import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

// Assets
import resVideo from "../assets/res-video.mp4";
import outletImg from "../assets/outlet.jpeg";
import reserveImg from "../assets/reservation-hall.jpeg";
import familyImg from "../assets/family.jpeg";
import menuImg from "../assets/menu.jpeg";

// Inline SVG Icons for social section (keeping them here as they are local to Home)
const Icons = {
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  ),
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  ),
  Threads: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.27 8.66A5 5 0 0 1 21 12a5 5 0 0 1-5 5 5 5 0 0 1-5-5V9h2v3a3 3 0 0 0 6 0 3 3 0 0 0-6 0v-2.22"></path><path d="M17.66 17.66A9 9 0 1 1 20 12"></path></svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
  ),
};

const Home = () => {
  return (
    <>
      <div className="h-screen bg-black p-4 lg:p-6 font-sans text-neutral-200 overflow-hidden">
        <div className="max-w-[1800px] mx-auto h-full grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 overflow-hidden">


          {/* Left Section: Main Video (Fixed) */}
          <div className="lg:col-span-3 h-[50vh] lg:h-full relative rounded-2xl lg:rounded-[1rem] overflow-hidden bg-[#0c0c0c] group shadow-2xl">
            <Navbar transparent={true} />

            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            >
              <source src={resVideo} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />

            {/* Social Icons Overlay (Bottom Right Corner) */}
            <div className="absolute bottom-2 right-6 z-30 flex items-center gap-4">
              <SocialIcon Icon={Icons.Instagram} />
              <SocialIcon Icon={Icons.Facebook} />
              <SocialIcon Icon={Icons.Threads} />
            </div>

            {/* Catchphrase Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-10 lg:bottom-20 left-6 lg:left-14 z-20 pointer-events-none"
            >
              <h1 className="text-3xl md:text-5xl lg:text-5xl font-serif text-[#f4eedb] leading-[1.1] drop-shadow-2xl opacity-95 tracking-tighter uppercase whitespace-pre-line">
                THE TRADITION OF{"\n"}EXCELLENCE !!
              </h1>
            </motion.div>
          </div>

          {/* Right Section: Scrollable Navigation Sidebar */}
          <div className="lg:col-span-1 h-full overflow-y-auto no-scrollbar flex flex-col gap-4 lg:gap-6 pb-20 lg:pb-0">
            <SideCard title="MENU" image={menuImg} link="/menu" delay={0.2} />
            <SideCard title="ABOUT US" image={familyImg} link="/about" delay={0.4} />
            <SideCard title="OUR OUTLETS" image={outletImg} link="/locations" delay={0.6} />
            <SideCard title="RESERVATIONS" image={reserveImg} link="/reservations" delay={0.8} />
          </div>

        </div>
      </div>
    </>
  );
};

const SocialIcon = ({ Icon }) => (
  <button className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition-all focus:outline-none drop-shadow-lg">
    <Icon />
  </button>
);

const SideCard = ({ title, image, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay }}
    className="relative min-h-[180px] lg:min-h-[22%] flex-1 group rounded-2xl lg:rounded-[1.5rem] overflow-hidden border border-white/5 shadow-xl"
  >
    <Link to={link} className="absolute inset-0 w-full h-full z-10 focus:outline-none block cursor-pointer" />
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-90 pointer-events-none"
      style={{ backgroundImage: `url(${image})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-6 lg:p-8 flex flex-col justify-end pointer-events-none">
      <div className="flex items-center justify-between w-full translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <span className="text-lg lg:text-base font-serif font-bold text-[#f4eedb] tracking-widest uppercase select-none">{title}</span>

        <div className="relative w-10 h-10 lg:w-11 lg:h-11 bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden transition-colors duration-500 shadow-lg group-hover:bg-white/20 flex items-center justify-center">
          <div className="absolute flex items-center justify-center transition-transform duration-500 ease-out group-hover:translate-x-8">
            <Icons.ArrowRight />
          </div>

          <div className="absolute flex items-center justify-center transition-transform duration-500 ease-out -translate-x-8 group-hover:translate-x-0">
            <Icons.ArrowRight />
          </div>
        </div>

      </div>
    </div>
  </motion.div>
);

export default Home;
