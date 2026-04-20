import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { getAssetUrl } from "../config";

const outletVideo = getAssetUrl("outletv.mp4");
const locationQr = getAssetUrl("locationqr.jpeg");
const outletImg = getAssetUrl("outlet.jpeg");


const Locations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#151515] to-[#222] text-white font-sans overflow-x-hidden">
      
      {/* Top Video Section with padding and rounded corners */}
      <div className="relative w-full h-[65vh] md:h-[85vh] p-4 md:p-6 lg:p-8">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-800 bg-black">
          <Navbar transparent={true} />
          
          {/* Background Video */}
          <video 
            src={outletVideo} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center pt-[15vh] pointer-events-none">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif text-white tracking-[0.15em] text-center drop-shadow-xl"
            >
              OUR OUTLETS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-4 text-xs md:text-sm font-light tracking-[0.2em] text-gray-300 uppercase"
            >
              Find your nearest location
            </motion.p>
          </div>
        </div>

        {/* Scroll indicator positioned right below the video block */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-500 animate-bounce pointer-events-none"
        >
          <span className="text-[10px] tracking-widest mb-1 uppercase">Scroll</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </motion.div>
      </div>

      {/* Details Section */}
      <div className="py-12 px-6 lg:px-12 w-full max-w-[1100px] mx-auto flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 w-full">
          
          {/* Left: Outlet Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/4 flex justify-center order-1 lg:order-1"
          >
            <div className="relative group w-[80%] max-w-[280px] lg:max-w-[240px]">
              <div className="absolute -inset-1 bg-white rounded-xl blur opacity-5 group-hover:opacity-15 transition duration-700"></div>
              <img 
                src={outletImg} 
                alt="Madeena Outlet" 
                className="relative w-full h-56 lg:h-64 rounded-xl shadow-lg object-cover border border-gray-700 transition-transform duration-700 hover:scale-105" 
              />
            </div>
          </motion.div>

          {/* Center: Location Details */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-2/4 text-center flex flex-col items-center bg-[#111] p-8 lg:p-10 rounded-[2rem] border border-gray-800 shadow-2xl relative overflow-hidden order-2 lg:order-2"
          >
            {/* Subtle glow behind the text box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-white opacity-[0.02] blur-3xl rounded-full pointer-events-none"></div>

            <h2 className="text-3xl md:text-3xl lg:text-4xl font-serif mb-4 tracking-wide text-white leading-tight">
              MADEENA <br/> RESTAURANT
            </h2>
            
            <p className="text-xs md:text-sm font-light mb-5 text-gray-400 leading-relaxed text-center">
              Ruwi, Near badr al samaa hospital<br/>
              Muscat, Oman 112
            </p>
            
            {/* Features block */}
            <div className="flex flex-col gap-2.5 mb-5 mx-auto text-xs md:text-sm text-gray-300">
              <p className="flex items-center justify-center gap-2"><span>🥯</span> Multi Cuisine Restaurant</p>
              <p className="flex items-center justify-center gap-2"><span>☕</span> Express Tea Counter</p>
              <p className="flex items-center justify-center gap-2"><span>🎤</span> Party Hall (Advance Booking)</p>
              <p className="flex items-center justify-center gap-2"><span>🍽️</span> Catering</p>
            </div>

            <div className="w-12 h-[1px] bg-gray-700 my-4 mx-auto"></div>
            
            <div className="space-y-1 mb-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Opening Hours</p>
              <p className="text-sm md:text-base font-medium tracking-wide text-gray-200">11:00 AM - 1:00 AM</p>
            </div>
            
            <div className="space-y-1 mb-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Ruwi Contact</p>
              <p className="text-sm md:text-base tracking-wide text-gray-200 hover:text-white transition-colors cursor-pointer">📞 95945674</p>
            </div>
            
            <a 
              href="https://maps.app.goo.gl/bCLVcPtDFfsWBRHfA" 
              target="_blank" 
              rel="noreferrer"
              className="mt-2 px-8 py-3 bg-white text-black text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Directions
            </a>
          </motion.div>

          {/* Right: Location QR Code */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-1/4 flex flex-col items-center justify-center space-y-4 order-3 lg:order-3"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-white rounded-lg blur opacity-5 group-hover:opacity-15 transition duration-700"></div>
              <img 
                src={locationQr} 
                alt="Scan for Location" 
                className="relative w-40 h-40 lg:w-44 lg:h-44 rounded-xl shadow-lg object-cover border border-gray-700 transition-transform duration-500 hover:scale-105" 
              />
            </div>
            <p className="text-xs md:text-sm tracking-[0.2em] text-gray-400 uppercase">Scan to map</p>
          </motion.div>
          
        </div>
      </div>
      
    </div>
  );
};

export default Locations;
