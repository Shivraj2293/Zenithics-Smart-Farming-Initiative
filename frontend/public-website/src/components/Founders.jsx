import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Founders = () => {
  return (
    <motion.div 
      initial={{opacity: 0, x:-200}}
      transition={{duration:1}}
      whileInView={{opacity:1, x:0}}
      viewport={{once: true}}
    
    
      className='container w-full px-6 py-4 pt-20 mx-auto my-20 overflow-hidden md:px-20 lg:px-32' id='Founders'>
      <h1 className='mb-2 text-2xl font-bold text-center sm:text-4xl'>Our <span className='font-light underline underline-offset-4 decoration-1 under'>Founders</span></h1>
      <p className='mx-auto mb-8 text-center text-gray-500 max-w-80'>We are a team of young founders, united by passion and fresh ideas, building solutions that make a real impact.</p>

      {/* Slider buttons */}
      <div className='flex items-center justify-end mb-8'>
        <button className='p-3 mr-2 bg-gray-200 rounded' aria-label='Previous'>
            <img src={assets.left_arrow} alt="Previous" />
        </button>
                <button className='p-3 mr-2 bg-gray-200 rounded' aria-label='Next'>
            <img src={assets.right_arrow} alt="Next" />
        </button>
      </div>

      {/* Customers Container Cards */}
      <div>

      </div>
    </motion.div>
  )
}

export default Founders
