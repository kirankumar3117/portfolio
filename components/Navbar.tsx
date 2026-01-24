'use client';

import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-center pointer-events-none"
    >
      {/* z-[100] ensures this is ALWAYS on top of the 3D Canvas.
         pointer-events-auto ensures the buttons are clickable.
      */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 pointer-events-auto flex items-center gap-8 shadow-2xl transition-all hover:bg-black/80">

        {/* YOUR NAME */}
        <span className="font-bold text-white tracking-widest text-lg cursor-pointer select-none">
          <a href="#">KIRAN KUMAR</a>
        </span>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
          <a href="#work" className="hover:text-white hover:scale-105 transition-transform duration-200">Work</a>
          <a href="#journey" className="hover:text-white hover:scale-105 transition-transform duration-200">Journey</a>
          <a href="#contact" className="hover:text-white hover:scale-105 transition-transform duration-200">Contact</a>
        </div>

        {/* Hire Me Button */}
        <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-purple-500 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
          <a href="#contact">Hire Me</a>
        </button>
      </div>
    </motion.nav>
  );
}