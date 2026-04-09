import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { MoveRight, Star, Clock, Globe, Utensils, Users } from "lucide-react";

// Importing all assets dynamically
const imagesGlob = import.meta.glob("../assets/*.{png,jpg,jpeg,webp}", { eager: true });
const videosGlob = import.meta.glob("../assets/*.{mp4,webm}", { eager: true });

const excludeKeywords = ["locationqr", "logo", "titlename", "menu"];

const images = Object.entries(imagesGlob)
  .filter(([path]) => !excludeKeywords.some(keyword => path.toLowerCase().includes(keyword)))
  .map(([path, module]) => ({
    path: module.default,
    name: path.split("/").pop().replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
  }));

const videos = Object.entries(videosGlob).map(([path, module]) => ({
  path: module.default,
  name: path.split("/").pop().replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
}));

const About = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <Navbar transparent={false} />

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-40 scale-105"
          >
            <source src={videos.find(v => v.path.includes("res-video"))?.path || ""} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-amber-500/50" />
              <span className="text-amber-500 uppercase tracking-[0.5em] text-xs font-bold">Since 1975</span>
              <div className="h-[1px] w-12 bg-amber-500/50" />
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-[#f4eedb] mb-6 tracking-tight">
              A Legacy of <br /> <span className="italic text-amber-500">Taste</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the tradition of authentic flavors perfected over generations.
            </p>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0" />
        </motion.div>
      </section>

      {/* Main Content - Our Story */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full border-x border-white/[0.03] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="h-[1px] grow bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <div className="relative">
                <div className="w-10 h-10 rotate-45 border border-amber-500/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber-500 rotate-45" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#f4eedb] tracking-[0.2em] uppercase">About Us</h2>
              <div className="relative">
                <div className="w-10 h-10 rotate-45 border border-amber-500/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber-500 rotate-45" />
                </div>
              </div>
              <div className="h-[1px] grow bg-gradient-to-l from-transparent via-amber-500/30 to-transparent" />
            </div>

            <div className="space-y-12 text-left md:text-center">
              <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light italic">
                "Our story began in 1975, when our founder, Abdul Majeed, opened the very first branch of our restaurant in Abu Dhabi. Built on passion, dedication, and a deep love for authentic flavors, what started as a humble beginning soon grew into a beloved name in the region."
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-16">
                <motion.div 
                   whileInView={{ opacity: 1, x: 0 }}
                   initial={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.8 }}
                   className="space-y-4 border-l border-amber-500/20 pl-6"
                >
                  <Utensils className="text-amber-500 w-8 h-8 mb-4" />
                  <h3 className="text-2xl font-serif text-[#f4eedb]">Our Mission</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    From day one, our mission has been simple to serve delicious, high-quality food that brings people together. With recipes inspired by tradition and perfected over generations, every dish reflects our commitment to taste, freshness, and hospitality.
                  </p>
                </motion.div>

                <motion.div 
                   whileInView={{ opacity: 1, x: 0 }}
                   initial={{ opacity: 0, x: 20 }}
                   transition={{ duration: 0.8 }}
                   className="space-y-4 border-l border-amber-500/20 pl-6"
                >
                  <Globe className="text-amber-500 w-8 h-8 mb-4" />
                  <h3 className="text-2xl font-serif text-[#f4eedb]">Regional Growth</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Over the years, we have proudly expanded across the UAE, Oman, Bahrain, and Qatar, becoming a destination for food lovers who appreciate both classic and contemporary cuisine. Despite our growth, we have stayed true to our roots.
                  </p>
                </motion.div>
              </div>

              <div className="pt-12 text-lg text-neutral-400 leading-relaxed max-w-3xl mx-auto space-y-8">
                <p>
                  Today, our restaurant stands as a symbol of family values, hard work, and a passion for excellence. Every meal we serve carries forward the legacy of Abdul Majeed—a legacy built on trust, quality, and unforgettable dining experiences.
                </p>
                <p className="font-serif text-[#f4eedb] text-2xl italic border-t border-white/5 pt-8">
                  We welcome you to be a part of our journey and experience the taste of tradition with us.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/50 border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Founded", value: "1975", icon: Clock },
            { label: "Countries", value: "4", icon: Globe },
            { label: "Awards", value: "25+", icon: Star },
            { label: "Happy Guests", value: "1M+", icon: Users },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <stat.icon className="w-6 h-6 text-amber-500/50 mx-auto mb-4 group-hover:text-amber-500 transition-colors" />
              <div className="text-4xl md:text-5xl font-serif text-[#f4eedb] mb-2">{stat.value}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Media Gallery Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#f4eedb] mb-4">Culinary Gallery</h2>
            <div className="w-24 h-[1px] bg-amber-500 mx-auto" />
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i % 4 * 0.1 }}
                className="relative overflow-hidden group rounded-2xl cursor-pointer"
              >
                <img 
                  src={img.path} 
                  alt={img.name} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div>
                    <p className="text-xs text-amber-500 uppercase tracking-widest mb-1">Authentic</p>
                    <h4 className="text-white font-serif text-lg capitalize">{img.name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Legacy Section */}
      {videos.length > 0 && (
        <section className="py-24 bg-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-[#f4eedb] mb-4">Legacy in Motion</h2>
              <div className="w-24 h-[1px] bg-amber-500 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {videos.map((video, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <div className="aspect-video relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <video 
                      controls 
                      className="w-full h-full object-cover"
                      poster={images[i % images.length]?.path}
                    >
                      <source src={video.path} type="video/mp4" />
                    </video>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-[#f4eedb] capitalize mb-2">{video.name}</h3>
                    <p className="text-neutral-500 text-sm tracking-wide">Capturing the essence of Madeena Restaurant through the years.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-neutral-600 text-[10px] uppercase tracking-[0.5em] text-center">
            © 2026 Madeena Restaurant. All Rights Reserved. <br className="md:hidden" />
            Crafting Unforgettable Dining Experiences Since 1975.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;








