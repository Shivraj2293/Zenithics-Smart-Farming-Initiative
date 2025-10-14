// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

// This function will eventually fetch real stats from a public backend endpoint
const getPlatformStats = async () => {
  return {
    farmersHelped: 142,
    waterSaved: 85000,
    landMonitored: 350,
  };
};

export default async function HomePage() {
  const stats = await getPlatformStats();

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 py-4 bg-transparent">
        <nav className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold text-white drop-shadow-md">
            Agrosphere
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-5 py-2 text-white font-medium rounded-full border-2 border-white/80 hover:bg-white hover:text-green-700 transition-all text-lg">
              Sign In
            </Link>
            <Link href="/signup" className="px-5 py-2 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-all text-lg">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
          <Image
            src="/images/hero-bg.jpg"
            alt="Vast agricultural field under a bright sky"
            fill
            style={{ objectFit: 'cover' }}
            quality={90}
            priority
            className="z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10"></div>
          <div className="relative z-20 text-white p-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight animate-fade-in-up [animation-delay:200ms]">
              Smarter Farming, Sustainable Future
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-light animate-fade-in-up [animation-delay:400ms]">
              Harness real-time data to optimize water usage, enhance crop health, and boost your profits.
            </p>
            <div className="mt-10 animate-fade-in-up [animation-delay:600ms]">
              <Link href="/signup" className="px-10 py-4 bg-green-500 text-white font-bold rounded-full text-xl hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg">
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Our Collective Impact</h2>
            <p className="text-lg text-gray-600 mb-12">By farming smarter, we're making a difference together.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-xl shadow-lg border-t-4 border-green-500">
                <h3 className="text-5xl font-extrabold text-green-600">{stats.farmersHelped}+</h3>
                <p className="mt-3 text-lg text-gray-600">Farmers Empowered</p>
              </div>
              <div className="bg-white p-10 rounded-xl shadow-lg border-t-4 border-blue-500">
                <h3 className="text-5xl font-extrabold text-blue-600">{stats.waterSaved.toLocaleString()}+</h3>
                <p className="mt-3 text-lg text-gray-600">Liters of Water Saved</p>
              </div>
              <div className="bg-white p-10 rounded-xl shadow-lg border-t-4 border-yellow-500">
                <h3 className="text-5xl font-extrabold text-yellow-600">{stats.landMonitored}+</h3>
                <p className="mt-3 text-lg text-gray-600">Acres Under Precision Monitoring</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}