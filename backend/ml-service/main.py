import os
import paho.mqtt.client as mqtt
import json
import psycopg2
from fastapi import FastAPI
from dotenv import load_dotenv

# Load variables from .env file into environment
load_dotenv()

# --- FastAPI App Setup ---
app = FastAPI()

# --- Database Connection ---
# Read credentials from environment variables, with fallbacks for local testing
DB_HOST = os.getenv("DATABASE_HOST", "localhost")
DB_NAME = os.getenv("DATABASE_NAME", "agrosphere_dev")
DB_USER = os.getenv("DATABASE_USER")
DB_PASS = os.getenv("DATABASE_PASSWORD")

conn = None
try:
    if not DB_USER or not DB_PASS:
        raise ValueError("DATABASE_USER and DATABASE_PASSWORD must be set in the .env file")
    
    conn = psycopg2.connect(host=DB_HOST, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
    print("✅ Database connection successful")
except (psycopg2.OperationalError, ValueError) as e:
    print(f"❌ Could not connect to the database: {e}")

# --- MQTT Client Setup ---
MQTT_BROKER = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883)) # Port must be an integer
MQTT_TOPIC = "agrosphere/sensors/+/data" 

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"✅ Connected to MQTT Broker at {MQTT_BROKER}!")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"Failed to connect to MQTT, return code {rc}\n")

def on_message(client, userdata, msg):
    print(f"⬇️  Received message from topic '{msg.topic}'")
    try:
        topic_parts = msg.topic.split('/')
        sensor_id = topic_parts[2]
        payload = json.loads(msg.payload.decode())
        
        if conn:
            cursor = conn.cursor()
            query = """
                INSERT INTO sensor_data (
                    time, sensor_id, air_temperature, air_humidity, soil_moisture, 
                    air_pressure, gas_resistance, rain, wind_speed, wind_direction,
                    soil_temperature, soil_conductivity, light_lux, latitude, longitude
                )
                VALUES (NOW(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            data_to_insert = (
                sensor_id,
                payload.get('t_a'), payload.get('h_a'), payload.get('m_s'),
                payload.get('p_a'), payload.get('gas'), payload.get('rn'),
                payload.get('ws'), payload.get('wd'), payload.get('t_s'),
                payload.get('c_s'), payload.get('lux'), payload.get('lat'),
                payload.get('lon')
            )
            cursor.execute(query, data_to_insert)
            conn.commit()
            cursor.close()
            print(f"   💾 Data for sensor '{sensor_id}' saved to TimescaleDB.")
        else:
            print("   ❌ Database connection not available. Data not saved.")

    except (json.JSONDecodeError, IndexError) as e:
        print(f"   ❌ Error processing message: {e}")
    except Exception as e:
        print(f"   ❌ An unexpected database error occurred: {e}")

# Create, configure, and start the MQTT client
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()
except Exception as e:
    print(f"❌ Failed to connect to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}. Please check the host and port. Error: {e}")


@app.get("/")
def read_root():
    return {"message": "ML Service is running, listening to MQTT, and saving to DB."}
