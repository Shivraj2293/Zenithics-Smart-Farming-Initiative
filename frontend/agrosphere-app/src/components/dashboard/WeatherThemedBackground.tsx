// src/components/dashboard/WeatherThemedBackground.tsx
'use client';
import Image from 'next/image';

const RainDrop = ({ delay }: { delay: number }) => (
  <div 
    className="absolute top-0 w-px h-12 bg-gradient-to-b from-transparent to-blue-300 animate-rain"
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${0.5 + Math.random() * 0.5}s`,
    }}
  ></div>
);

export default function WeatherThemedBackground({ condition, children }: { condition: string; children: React.ReactNode }) {
  let bgImage = '/images/sunny-bg.jpg';
  if (condition === 'Rain') bgImage = '/images/rainy-bg.jpg';
  if (condition === 'Clouds') bgImage = '/images/cloudy-bg.jpg';

  const isRaining = condition === 'Rain';

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Section */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] -z-10">
        <Image
          src={bgImage}
          alt="Weather background"
          fill
          style={{ objectFit: 'cover' }}
          quality={80}
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        {isRaining && Array.from({ length: 100 }).map((_, i) => <RainDrop key={i} delay={Math.random()} />)}
      </div>

      {/* Page Content */}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}