import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetUrl } from "../config";

const Icons = {
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  Decoration: () => (
    <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10H35M45 10H80M35 10L40 6L45 10L40 14L35 10Z" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
    </svg>
  )
};

const Navbar = ({ transparent = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const logoImg = getAssetUrl("madeena-logo.png");
  const titleImg = getAssetUrl("titlename.jpeg");

  const location = useLocation();
  const isHome = location.pathname === "/";

  const menuItems = [
    { name: "HOME", path: "/" },
    { name: "MENU", path: "/menu" },
    { name: "ORDER", path: "/order" },
    { name: "RESERVATIONS", path: "/reservations" },
    { name: "ABOUT", path: "/about" },
    { name: "OUR OUTLETS", path: "/locations" },
  ];

  return (
    <>
      {/* Trigger Navbar (Floating) */}
      <div className={`${transparent ? "absolute" : "relative bg-[#0a0a0a]"} top-0 left-0 w-full z-40 ${isHome ? "p-6 lg:p-10" : "pt-2 lg:pt-4 px-6 lg:px-10 pb-6"} flex items-center ${isHome ? "justify-start" : "justify-center"} gap-6 pointer-events-none`}>
        {/* Toggle Button */}
        {!isOpen && (
          <motion.button
            layoutId="menu-toggle"
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all text-white focus:outline-none pointer-events-auto shadow-lg"
          >
            <Icons.Menu />
          </motion.button>
        )}

        {/* Logo to the RIGHT of toggle button */}
        {!isOpen && (
          <Link to="/" className="relative flex items-center pointer-events-auto h-12 lg:h-16">
            {/* Title Image (Banner) */}
            <img 
              src={titleImg} 
              alt="Madeena Title" 
              className="h-full w-auto object-contain rounded-xl shadow-md" 
            />
            {/* Logo on top of the left side of the banner */}
            <motion.div
              layoutId="logo-main"
              className="absolute left-[2.5%] top-0 h-full flex items-center justify-center p-0"
            >
              <img src={logoImg} alt="Madeena Logo" className="h-[105%] w-auto drop-shadow-2xl" />
            </motion.div>
          </Link>
        )}
      </div>

      {/* Full Screen Menu Overlay styled exactly like the uploaded image */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-[#121212] p-4 flex items-center justify-center font-sans"
          >
            {/* Inner Border Frame */}
            <div className="relative w-full h-full border border-white/5 rounded-[1rem] flex flex-col items-center justify-center bg-[#0d0d0d] shadow-2xl">

              {/* Top Left Close Button - Modeled like image */}
              <motion.button
                layoutId="menu-toggle"
                onClick={() => setIsOpen(false)}
                className="absolute top-6 left-6 lg:top-8 lg:left-8 w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-white hover:text-white hover:border-white/30 hover:bg-white/5 transition-all focus:outline-none z-20 shadow-lg"
              >
                <Icons.Close />
              </motion.button>

              {/* Logo in the RIGHT corner of THAT open page with move transition */}
              <motion.div
                layoutId="logo-main"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute top-6 right-6 lg:top-8 lg:right-8 z-10"
              >
                <img src={logoImg} alt="Madeena Logo" className="h-10 lg:h-12 w-auto opacity-100 hover:opacity-100 transition-opacity" />
              </motion.div>

              {/* Menu Content Box */}
              <div className="relative z-10 flex flex-col items-center text-center">

                {/* Top Diamond Decoration */}
                <div className="text-[#e2dbca] mb-8">
                  <Icons.Decoration />
                </div>

                {/* Menu Links */}
                <div className="flex flex-col gap-6">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 + 0.2 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="text-2xl md:text-4xl lg:text-[2.6rem] font-serif tracking-[0.1em] text-[#e2dbca] hover:text-white hover:scale-105 inline-block transition-all font-normal"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Diamond Decoration */}
                <div className="text-[#e2dbca] mt-8">
                  <Icons.Decoration />
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
