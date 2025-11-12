import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30 bg-black/20'>
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logo} alt="logo" className="w-36 h-auto"/>
      </Link>
      <Link
        to="/"
        className="px-4 py-2 text-sm bg-primary/90 hover:bg-primary rounded-md font-medium cursor-pointer transition-colors"
      >
        Home Page
      </Link>
    </div>
  )
}

export default AdminNavbar
