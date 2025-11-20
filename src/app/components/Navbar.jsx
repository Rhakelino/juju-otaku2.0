"use client";

import Link from 'next/link';
import { useState } from 'react';

const Navbar = ({ user }) => { 
  const [isOpen, setIsOpen] = useState(false);
  const useDatabase = process.env.NEXT_PUBLIC_USE_DATABASE === 'true';

  const navLinks = [
    { href: "/populer", name: "Populer" },
    { href: "/movie", name: "Movie" },
    { href: "/genre", name: "Genre" },
    { href: "/schedule", name: "Schedule" },
    { href: "https://link.sankanime.com", name: "Web Sankanime" },
    { href: "https://www.whatsapp.com/channel/0029VbBv5edGk1Fo8WbsAK1V", name: "Join Komunitas" },
  ];

  if (useDatabase) {
    if (user) {
      navLinks.push({ href: "/users/dashboard", name: "Dashboard" });
      navLinks.push({ href: "/users/dashboard/my-history", name: "History" });
      navLinks.push({ href: "/api/auth/signout", name: "Logout" });
    } else {
      navLinks.push({ href: "/api/auth/signin", name: "Login" });
    }
  } else {
    navLinks.push({ href: "/users/dashboard/my-history", name: "History" });
    if (user) {
      navLinks.push({ href: "/users/dashboard", name: "Dashboard" });
      navLinks.push({ href: "/api/auth/signout", name: "Logout" });
    }
  }

  return (
    <nav className="w-full md:pt-10 pt-5 relative z-50">
      <div className="container mx-auto flex justify-center items-center px-4">
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className="text-neutral-300 hover:text-pink-500 transition-colors duration-200 font-medium text-md"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="md:hidden w-full">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            aria-label="Toggle menu"
            className="text-white focus:outline-none"
          >
            <svg 
              className="w-10 h-10" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              >
              </path>
            </svg>
          </button>
        </div>
      </div>

      <div className={`
        md:hidden absolute top-full left-0 right-0 bg-[#1A1A29] 
        transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'max-h-screen shadow-lg' : 'max-h-0'}
      `}>
        <ul className="flex flex-col p-4">
          {navLinks.map((link) => (
            <li key={link.href} className="w-full">
              <Link 
                href={link.href} 
                className="block py-3 px-2 text-neutral-200 hover:bg-pink-700 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
