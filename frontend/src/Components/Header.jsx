import React, { useState } from 'react'
import { Bars3Icon} from '@heroicons/react/24/solid'

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
   <header className="flex justify-between px-5 py-2 bg-primary">
    <a className='font-bold text-black' href="#">Hari Hara Raja Sudhan R</a>
    <nav className="hidden md:block" >
      <ul className="flex text-white">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Projects</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
    </nav>
     {isMobileMenuOpen && <nav className="block md:hidden " >
      <ul className="flex flex-col text-white mobile-nav">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Projects</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
    </nav>}
    <button className="block md:hidden" onClick={()=>setIsMobileMenuOpen(!isMobileMenuOpen)}><Bars3Icon className=" text-white h-5 w-5"  /></button>
  
   </header>

)}
