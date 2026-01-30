import React from 'react'
import { Link } from 'react-router-dom'
import dp from '../assets/dp.png'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border h-[calc(100vh-100px)]'>
      {/* Text Content */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-6 sm:py-8'>
        <div className='text-gray-700 px-6 sm:px-10 max-w-md'>
          <a 
            href='https://www.instagram.com/gaurishirkee' 
            target='_blank' 
            rel='noopener noreferrer'
            className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900 hover:text-purple-600 transition-colors inline-block'
          >
            @gaurishirkee
          </a>
          
          <h2 className='text-lg sm:text-xl font-semibold mb-3 text-purple-600'>
            Yarn Yapper 🧶
          </h2>
          
          <div className='space-y-2 text-[11px] sm:text-xs leading-relaxed'>
            <p>
              A home-grown venture sharing exclusive slow-fashion products all over India.
            </p>
            
            <p>
              Our online store is fully stocked with hand-woven and hand-stitched accessories. Our products are lightweight, unique, and trendy — perfect for adding a creative touch to your style.
            </p>
            
            <p>
              From budget-friendly options to premium quality pieces, we have it all! Can't find what you're looking for? We're always happy to create custom orders for our valued clients.
            </p>
            
            <p className='font-semibold text-purple-600'>
              ✨ It's time for a burst of colors in your life with high-quality handcrafted items!
            </p>
          </div>
          
          <Link to='/shop'>
            <button className='mt-4 bg-purple-600 text-white px-5 py-2 text-xs rounded hover:bg-purple-700 transition-colors'>
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      {/* Image Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center bg-purple-50 overflow-hidden'>
        <img src={dp} alt="Gauri Shirke" className='h-full w-auto object-cover'/>
      </div>
    </div>
  )
}

export default Hero