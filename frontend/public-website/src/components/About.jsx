import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <motion.div
      initial={{opacity: 0, x:200}}
      transition={{duration:1}}
      whileInView={{opacity:1, x:0}}
      viewport={{once: true}}
    
    className='container flex flex-col items-center justify-center w-full mx-auto overflow-hidden p-14 md:px-20 lg:px-32' id='About'>
        <h1 className='mb-2 text-2xl font-bold sm:text-1xl'>About <span className='font-light underline underline-offset-4 decoration-1 under'>Our Website</span></h1>
        <p className='mb-8 text-center text-gray-500 max-w-80'>Stay connected to your fields with real-time insights on soil, irrigation, and weather — helping farmers grow smarter every season.</p>
        <div className='flex flex-col items-center md:flex-row md:items-start md:gap-20'>
            <img src={assets.background_image3} className='w-full h-auto max-w-lg sm:w-1/2' alt="" />
            <div className='flex flex-col items-center mt-10 text-gray-600 md:items-start'>
                <div className='grid w-full grid-cols-2 gap-6 md:gap-10 2xl:pr-28'>
                    <div>
                        <p className='font-medium text-gray-800 text-1xl'>- AI in Farming</p>
                        <p>Smart insights powered by AI and IoT for better crop and soil management.</p> 
                    </div>
                                        <div>
                        <p className='font-medium text-gray-800 text-1xl'>- For Farmers, By Innovation</p>
                        <p>Technology designed to simplify farming and empower every farmer.</p> 
                    </div>
                                        <div>
                        <p className='font-medium text-gray-800 text-1xl'>- Young & Vision-Driven</p>
                        <p>A fresh startup with big ideas to transform agriculture.</p> 
                    </div>
                                        <div>
                        <p className='font-medium text-gray-800 text-1xl'>- Growing Sustainably</p>
                        <p>Helping farmers save water, improve yield, and secure a greener future.</p> 
                    </div>
                </div>
                <p className='max-w-lg my-10'>At Agrosphere, we use IoT and AI to give farmers real-time insights, making agriculture smarter, efficient, and sustainable.</p>
                <button className='px-8 py-2 text-white bg-blue-600 rounded'>Learn More</button>
            </div>
        </div>
      
    </motion.div>
  )
}

export default About
