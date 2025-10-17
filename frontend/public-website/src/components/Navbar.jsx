import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'


const Navbar = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    if(showMobileMenu){
        document.body.style.overflow = 'hidden'
    }else{
        document.body.style.overflow = 'auto'
    }
    return ()=> {
        document.body.style.overflow = 'auto'
    }
  },[showMobileMenu])

  return (
    <div className='absolute top-0 left-0 z-10 w-full'>
      <div className='container flex items-center justify-between px-6 py-4 mx-auto'>
        {/* Logo */}
        <img src={assets.logo} alt="Zenithics Logo" className='w-36' />
        
        {/* Navigation */}
        <ul className='hidden gap-8 md:flex'>
          <li><a href="#Home" className='cursor-pointer hover:text-gray-400'>Home</a></li>
          <li><a href="#Founders" className='cursor-pointer hover:text-gray-400'>Founders</a></li>
          <li><a href="#Dashboard" className='cursor-pointer hover:text-gray-400'>Dashboard</a></li>
          <li><a href="#About" className='cursor-pointer hover:text-gray-400'>About Us</a></li>
          <li><a href="#Contact" className='cursor-pointer hover:text-gray-400'>Contact Us</a></li>
        </ul>
        
        {/* Sign Up button */}
        <button className='hidden px-8 py-2 bg-white rounded-full md:block'>Sign Up</button>
        <img onClick={()=> setShowMobileMenu(true)} src={assets.menu_icon} className='cursor-pointer md:hidden w-7' alt="" />
      </div>
      {/* Mobile menu */}
      <div className={`fixed top-0 bottom-0 right-0 w-full overflow-hidden 
      transition-all bg-white md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'}`}>

        <div className='flex justify-end p-6 cursor-pointer'>
          <img onClick={()=> setShowMobileMenu(false)} src={assets.cross_icon} className='w-6' alt="" />
        </div>

        <ul className='flex flex-col items-center gap-2 px-5 mt-5 text-lg font-medium'>
          <a onClick={()=> setShowMobileMenu(false)} href="" className='inline-block px-4 py-2 rounded-full'>Home</a>
          <a onClick={()=> setShowMobileMenu(false)} href="" className='inline-block px-4 py-2 rounded-full'>Founders</a>
          <a onClick={()=> setShowMobileMenu(false)} href="" className='inline-block px-4 py-2 rounded-full'>Dashboard</a>
          <a onClick={()=> setShowMobileMenu(false)} href="" className='inline-block px-4 py-2 rounded-full'>About Us</a>
          <a onClick={()=> setShowMobileMenu(false)} href="" className='inline-block px-4 py-2 rounded-full'>Contact Us</a>
        </ul>
      </div>
    </div>
  )
}

export default Navbar