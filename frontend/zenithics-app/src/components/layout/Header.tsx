// src/components/layout/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 bg-transparent">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold text-white drop-shadow-md">
          zenithics
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-white/90 hover:text-white transition-colors text-lg font-medium">Features</Link>
          <Link href="#about" className="text-white/90 hover:text-white transition-colors text-lg font-medium">About</Link>
          <Link href="#support" className="text-white/90 hover:text-white transition-colors text-lg font-medium">Support</Link>
        </div>
        <div className="flex items-center space-x-4">
          
          {/* --- UPDATED SIGN IN BUTTON --- */}
          <Link 
            href="/login" 
            className="group flex items-center px-5 py-2 text-white font-medium rounded-full border-2 border-white/80 hover:bg-white hover:text-green-700 transition-all duration-300 ease-in-out"
          >
            <span>Sign In</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </Link>

          {/* --- UPDATED SIGN UP BUTTON --- */}
          <Link 
            href="/signup" 
            className="group flex items-center px-5 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-px"
          >
            <span>Sign Up</span>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </Link>

        </div>
      </nav>
    </header>
  );
}