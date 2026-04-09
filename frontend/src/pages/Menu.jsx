import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

// Dynamically import all images from the assets folder.
const assetModules = import.meta.glob('../assets/*.{jpeg,jpg,png,webp}', { eager: true, query: '?url', import: 'default' });

const getImage = (name) => {
  if (!name) return null;
  const match = Object.keys(assetModules).find(path => {
    const fileName = path.split('/').pop().split('.')[0];
    return fileName.toLowerCase() === name.toLowerCase();
  });
  return match ? assetModules[match] : null;
};

const menuData = [
  {
    category: "SALADS", arabicCategory: "السلطات", type: "grid",
    items: [
      { name: "Greek Salad", arabic: "سلطة يونانية", price: "1.785 OMR", imageKey: "Greek Salad" },
      { name: "Arabic Salad", arabic: "سلطة عربية", price: "1.575 OMR", imageKey: "Arabic Salad" },
      { name: "Shirazi Salad", arabic: "سلطة شيرازي", price: "1.785 OMR", imageKey: "Shirazi Salad" },
      { name: "Fattoush", arabic: "فتوش", price: "1.785 OMR", imageKey: "Fattoush" },
      { name: "Mixed Salad with Bread", arabic: "سلطة مشكلة مع خبز", price: "2.835 OMR", imageKey: "Mixed Salad with Bread" },
      { name: "Hummus with Bread", arabic: "حمص مع خبز", price: "1.575 OMR", imageKey: "Hummus with Bread" },
      { name: "Mutabal with Bread", arabic: "متبل مع خبز", price: "1.575 OMR", imageKey: "Mutabal with Bread" },
      { name: "Vine Leaves", arabic: "ورق عنب", price: "1.890 OMR", imageKey: "Vine Leaves" },
      { name: "Mast Cucumber", arabic: "ماست خيار", price: "1.365 OMR", imageKey: "Mast Cucumber" },
      { name: "Lentil Soup with Bread", arabic: "شوربة عدس مع خبز", price: "1.785 OMR", imageKey: "Lentil Soup with Bread" },
      { name: "Falodeh", arabic: "فالودة", price: "1.680 OMR", imageKey: "Falodeh" },
      { name: "Kunafa With Iranian Tea", arabic: "كنافة مع شاي ايراني", price: "2.310 OMR", imageKey: "Kunafa With Iranian Tea" },
      { name: "Only Kunafa", arabic: "كنافة فقط", price: "2.100 OMR", noImage: true }
    ]
  },
  {
    category: "Meals with Rice & 2 Skewers", arabicCategory: "وجبات مع أرز وسيحين", type: "grid_rectangle",
    items: [
      { name: "Kabab Chicken", arabic: "كباب دجاج", price: "4.095 OMR", imageKey: "Kabab Chicken" },
      { name: "Kabab Lamb", arabic: "كباب لحم", price: "4.095 OMR", imageKey: "Kabab Lamb" },
      { name: "Shish Tawook", arabic: "شيش طاووق", price: "4.305 OMR", imageKey: "Shish Tawook" },
      { name: "Lamb Chops", arabic: "ريش لحم", price: "5.880 OMR", imageKey: "Lamb Chops" },
      { name: "Shish Tawook / Lamb Yoghurt", arabic: "شيش طاووق / لحم بالروب", price: "4.410 OMR", imageKey: "Shish Tawook Lamb Yoghurt" },
      { name: "Lamb Yoghurt", arabic: "لحم بالروب", price: "4.410 OMR", imageKey: "Lamb Yoghurt" },
      { name: "Chicken Yoghurt", arabic: "دجاج بالروب", price: "4.305 OMR", imageKey: "Chicken Yoghurt" },
      { name: "Kabab Mix", arabic: "مشكل كباب", price: "4.095 OMR", imageKey: "Kabab Mix" },
      { name: "Tandoori Chicken", arabic: "دجاج تندوري", price: "4.305 OMR", imageKey: "Tandoori Chicken" },
      { name: "Grilled Fish Fillet", arabic: "فيليه سمك مشوي", price: "4.725 OMR", imageKey: "Grilled Fish Fillet" },
      { name: "Joojeh Tikka", arabic: "جوجه تيكا", price: "4.725 OMR", imageKey: "Joojeh Tikka" },
      { name: "Lamb Tikka", arabic: "تيكا لحم", price: "4.410 OMR", imageKey: "Lamb Tikka" },
      { name: "Bakhtiari Kabab", arabic: "كباب بختياري", price: "5.040 OMR", imageKey: "Bakhtiari Kabab" },
      { name: "Charcoal Chicken", arabic: "دجاج على الفحم", price: "3.990 OMR", imageKey: "Charcoal Chicken" },
      { name: "Sultani Steak", arabic: "ستيك سلطاني", price: "5.040 OMR", imageKey: "Sultani Steak" },
      { name: "Burberry Rice", arabic: "أرز بربري", price: "1.680 OMR", imageKey: "Burberry Rice" },
      { name: "Saffron Rice", arabic: "أرز زعفران", price: "1.260 OMR", imageKey: "Saffron Rice" },
      { name: "White Rice", arabic: "أرز أبيض", price: "1.050 OMR", imageKey: "White Rice" },
    ]
  },
  {
    category: "Meal Platters", arabicCategory: "أطباق الوجبات", type: "platters",
    items: [
      { name: "Family Meal Combo", arabic: "وجبة عائلية متنوعة", price: "10.000 OMR", fullWidth: true, imageKey: "Family Meal Combo" },
      { name: "Meal for Three Combo", arabic: "وجبة كومبو لثلاثة أشخاص", price: "9.000 OMR", fullWidth: true, imageKey: "Meal for Three Combo" },
      { name: "Meal for Two Combo", arabic: "وجبة لشخصين", price: "8.000 OMR", fullWidth: true, imageKey: "Meal for Two Combo" },
      { name: "Full Lamb", arabic: "خروف كامل", price: "", imageKey: "Full Lamb" },
      { name: "Mix BBQ With Rice For 4 Person", arabic: "مزيج مشوي أرز 4أشخاص", price: "9.500 OMR", imageKey: "Mix BBQ With Rice For 4 Person" },
      { name: "BBQ Family Jumbo", arabic: "باربيكيو عائلي جامبو", price: "6.000 OMR", imageKey: "BBQ Family Jumbo" },
      { name: "Bukhari Rice with Shawaya", arabic: "رز بخاري شوايا", price: "4.000 OMR", imageKey: "Bukhari Rice with Shawaya 3 Persons" },
    ]
  },
  {
    category: "Meals with Bread & 2 Skewers", arabicCategory: "وجبات مع خبز وسيحين", type: "list", footerKey: "Meals with Bread & 2 Skewers",
    items: [
      { name: "Kabab Chicken / Chicken Yoghurt", arabic: "كباب دجاج / دجاج بالروب", price: "4.410 OMR" },
      { name: "Kabab Mix", arabic: "مشكل كباب", price: "4.410 OMR" },
      { name: "Tandoori Chicken / Shish Tawook", arabic: "دجاج تندوري / شيش طاووق", price: "4.410 OMR" },
      { name: "Mixed Kabab / Tika Combo", arabic: "مشكل كباب / تيكا كومبو", price: "5.775 OMR" },
      { name: "Lamb Tikka / Chicken Yoghurt", arabic: "تيكا لحم / دجاج بالروب", price: "4.620 OMR" },
      { name: "Lamb Tikka / Joojeh", arabic: "تيكا لحم / جوجه تيكا", price: "4.935 OMR" },
    ]
  },
  {
    category: "Meals with Rice & 1 Skewer", arabicCategory: "وجبات مع أرز وسيح واحد", type: "list", footerKey: "Meals with Rice & 1 Skewer",
    items: [
      { name: "Kabab Chicken", arabic: "كباب دجاج", price: "3.045 OMR" },
      { name: "Joojeh Tikka", arabic: "جوجه تيكا", price: "3.255 OMR" },
      { name: "Kabab Lamb", arabic: "كباب لحم", price: "3.045 OMR" },
      { name: "Lamb Tikka", arabic: "تيكا لحم", price: "3.255 OMR" },
      { name: "Shish Tawook", arabic: "شيش طاووق", price: "3.045 OMR" },
      { name: "Kofta Kabab", arabic: "كباب كفته", price: "3.045 OMR" },
      { name: "Tandoori Chicken", arabic: "دجاج تندوري", price: "3.045 OMR" },
      { name: "Lamb Yoghurt", arabic: "لحم الروب", price: "3.255 OMR" },
      { name: "Chicken Yoghurt", arabic: "دجاج بالروب", price: "3.045 OMR" },
    ]
  },
  {
    category: "Meal with Tandoori Bread 1 Skewer", arabicCategory: "وجبة مع خبز تندوري", type: "list", footerKey: "Meal with Tandoori Bread 1 Skewer",
    items: [
      { name: "Joojeh Tikka", arabic: "جوجه تيكا", price: "3.570 OMR" },
      { name: "Chicken Yoghurt", arabic: "دجاج بالروب", price: "3.465 OMR" },
      { name: "Tandoori Chicken", arabic: "دجاج تندوري", price: "3.360 OMR" },
      { name: "Kabab Lamb", arabic: "كباب لحم", price: "3.360 OMR" },
      { name: "Shish Tawook", arabic: "شيش طاووق", price: "3.360 OMR" },
      { name: "Lamb Tikka", arabic: "تيكا لحم", price: "3.570 OMR" },
      { name: "Kabab Chicken", arabic: "كباب دجاج", price: "3.360 OMR" },
      { name: "Lamb Yoghurt", arabic: "لحم الروب", price: "3.570 OMR" },
    ]
  },
  {
    category: "Grilled Sandwiches", arabicCategory: "ساندوتشات مشوية", type: "sandwiches", footerKey: "Grilled Sandwiches",
    items: [
      { name: "Kabab Lamb", arabic: "كباب لحم" },
      { name: "Tandoori Chicken", arabic: "دجاج تندوري" },
      { name: "Kabab Chicken", arabic: "كباب دجاج" },
      { name: "Lamb Tikka", arabic: "تيكا لحم" },
      { name: "Shish Tawook", arabic: "شيش طاووق" },
      { name: "Chicken Yoghurt", arabic: "دجاج بالروب" },
    ]
  },
  {
    category: "Grilled Burgers", arabicCategory: "البرجر المشوي", type: "burgers", footerKey: "Grilled Burgers",
    items: [
      { name: "Grilled Lamb Burger\nwith fries and drink", arabic: "برجر لحم مشوي\nمع بطاطس ومشروب", price: "2.100\nOMR", burgerOnly: "1.785\nOMR" },
      { name: "Grilled Chicken Burger\nwith fries and drink", arabic: "برجر دجاج مشوي\nمع بطاطس ومشروب", price: "1.785\nOMR", burgerOnly: "1.680\nOMR" },
    ]
  }
];

const Menu = () => {
  const heroImageSrc = getImage("menu") || getImage("titlename") || getImage("hero");

  return (
    // Premium elegant dark-slate grey outer background theme 
    <div className="bg-[#2a2a2d] text-white font-sans selection:bg-[#8C231F] selection:text-white pb-24">

      {/* 
        Hero Section: Majestic Full Screen Height
      */}
      <div className="relative w-full h-[70vh] md:h-[85vh] p-4 md:p-6 lg:p-8">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#4a4a50] bg-black">
          <Navbar transparent={true} />

          {heroImageSrc && (
            <img
              src={heroImageSrc}
              alt="Madeena Menu Header"
              className="w-full h-full object-cover object-center opacity-70"
            />
          )}

          {/* Removed gradient overlay heavily based on user's manual change previously */}
          <div className="absolute inset-0 pointer-events-none" />

          <div className="absolute bottom-10 left-8 md:bottom-16 md:left-16 lg:bottom-20 lg:left-20 z-10 pointer-events-none">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-widest uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none"
            >
              The Menu
            </motion.h1>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-[#d8d8dc] tracking-[0.5em] lg:tracking-[0.6em] text-[8px] md:text-[10px] lg:text-xs font-bold uppercase mt-4 block"
            >
              A Symphony of Spices
            </motion.span>
          </div>
        </div>
      </div>

      {/* Menu Detail Section */}
      <div className="max-w-[1300px] mx-auto px-4 lg:px-8 pt-16 space-y-20 relative z-20">

        {menuData.map((section, sIndex) => (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            key={sIndex}
            // Rich inner card background
            className="bg-[#38383c] rounded-[2rem] p-5 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-[#4a4a50] relative"
          >
            {/* Soft Transparent Pattern Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px] rounded-[2rem]" />

            {/* Header Box using Maroon from reference image */}
            <div className="flex justify-center -mt-10 lg:-mt-14 mb-10 relative z-20">
              <div className="bg-[#8C231F] border-[2px] border-[#4a4a50] text-white px-8 py-2 md:px-12 md:py-3 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-center flex flex-col items-center min-w-[260px]">
                <span className="text-white/80 text-xs md:text-sm font-bold mb-0.5 tracking-widest">{section.arabicCategory}</span>
                <h3 className="text-lg md:text-xl font-serif uppercase tracking-widest">{section.category}</h3>
              </div>
            </div>

            {/* Grid layout (Salads) => Uniform w-36 h-36 to md:w-44 md:h-44 squares */}
            {section.type === "grid" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 text-center relative z-10">
                {section.items.map((item, idx) => {
                  const imageSrc = getImage(item.imageKey);
                  return (
                    <div key={idx} className="flex flex-col items-center group">
                      {item.noImage || !imageSrc ? (
                        <div className="w-36 h-36 md:w-40 md:h-40 border-[3px] border-[#4a4a50] bg-[#2a2a2d]/50 rounded-2xl p-2 text-white font-bold text-xs uppercase flex flex-col items-center justify-center mb-4 shadow-md hover:border-[#8C231F] transition-colors mx-auto">
                          <span className="text-[#a1a1a6] mb-1">{item.arabic}</span>
                          <span className="tracking-widest">{item.name}</span>
                        </div>
                      ) : (
                        <div className="relative mb-4 w-36 h-36 md:w-40 md:h-40 mx-auto bg-[#1e1e20] rounded-2xl flex items-center justify-center border-[3px] border-[#4a4a50] shadow-xl overflow-visible group-hover:scale-105 group-hover:shadow-2xl group-hover:border-[#8C231F] transition-all duration-500">
                          <img src={imageSrc} alt={item.name} className="object-cover rounded-[1rem] w-full h-full" />
                          {item.price && (
                            <div className="absolute -bottom-3 -right-3 bg-[#8C231F] text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-[9px] md:text-[10px] shadow-lg whitespace-pre-line leading-tight">
                              {item.price.replace(" ", "\n")}
                            </div>
                          )}
                        </div>
                      )}

                      {!item.noImage && item.price && !imageSrc && (
                        <div className="font-bold text-[#8C231F] mb-2">{item.price}</div>
                      )}

                      {!item.noImage && (
                        <>
                          <span className="font-bold text-white text-[11px] md:text-sm leading-tight mb-1">{item.arabic}</span>
                          <span className="text-[10px] md:text-xs font-bold text-[#a1a1a6] leading-tight uppercase tracking-wider">{item.name}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Grid Rectangle layout (Skewers & Rice) => Identical Dimensions as Salads */}
            {section.type === "grid_rectangle" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 text-center relative z-10 w-full">
                {section.items.map((item, idx) => {
                  const imageSrc = getImage(item.imageKey);
                  return (
                    <div key={idx} className="flex flex-col items-center group w-full">
                      <div className="relative mb-4 w-36 h-36 md:w-40 md:h-40 mx-auto bg-[#1e1e20] rounded-2xl flex items-center justify-center shadow-xl overflow-visible border-[3px] border-[#4a4a50] group-hover:border-[#8C231F] group-hover:shadow-[0_15px_30px_rgba(140,35,31,0.3)] transition-all duration-500">
                        {imageSrc ? (
                          <img src={imageSrc} alt={item.name} className="object-cover rounded-[1rem] w-full h-full group-hover:opacity-90 transition-opacity" />
                        ) : (
                          <span className="text-[#636368] text-[10px] uppercase tracking-widest font-bold">Image Coming Soon</span>
                        )}
                        {item.price && (
                          <div className="absolute -bottom-3 -right-3 bg-[#8C231F] text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-[9px] md:text-[10px] shadow-lg whitespace-pre-line leading-tight transform group-hover:scale-110 transition-transform">
                            {item.price.replace(" ", "\n")}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-white text-[11px] md:text-sm leading-tight mb-1">{item.arabic}</span>
                      <span className="text-[10px] md:text-xs font-bold text-[#a1a1a6] leading-tight uppercase tracking-wider">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* =============== SCALED DOWN SECTIONS BELOW =============== */}

            {/* Platters Layout => Decreased overall size */}
            {section.type === "platters" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                {section.items.map((item, idx) => {
                  const imageSrc = getImage(item.imageKey);
                  return (
                    <div key={idx} className={`flex flex-col items-center bg-[#46464a] rounded-[1.5rem] shadow-lg border border-[#5a5a60] overflow-hidden group ${item.fullWidth ? "md:col-span-2 max-w-[42rem] mx-auto w-full" : "w-full max-w-[22rem] mx-auto"}`}>
                      {/* Reduced height from h-56/22rem to h-48/16rem */}
                      <div className="relative w-full h-48 md:h-[16rem] bg-[#2a2a2d] flex items-center justify-center overflow-hidden">
                        {imageSrc ? (
                          <img src={imageSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#2a2a2d]">
                            <span className="text-[#636368] uppercase tracking-[0.3em] font-bold text-[10px]">Waiting for Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2d]/80 via-transparent to-transparent opacity-80" />
                      </div>

                      {/* Header Overlaid on Platter - Using Maroon */}
                      <div className="relative z-10 -mt-8 bg-[#8C231F] border border-[#a43b38] px-5 py-2 rounded-xl text-center shadow-md w-11/12 max-w-[16rem]">
                        <span className="block text-xs font-bold mb-0.5 text-white/80">{item.arabic}</span>
                        <span className="block font-serif text-base md:text-lg tracking-wide text-white">{item.name}</span>
                      </div>

                      {/* Decreased price text size */}
                      <div className="my-4 font-serif text-white text-xl tracking-[0.1em] font-bold">
                        {item.price || <span className="text-xs opacity-60 tracking-widest text-[#d8d8dc]">Ask for Price</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List Layout (Skewers mostly) => Reduced font sizes and gaps */}
            {section.type === "list" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 relative z-10 max-w-4xl mx-auto">
                {section.items.map((item, iIndex) => (
                  <div key={iIndex} className="flex justify-between items-center border-b border-dashed border-[#5a5a60] pb-2 group hover:border-[#8C231F] transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-[13px] md:text-sm tracking-wide group-hover:text-[#8C231F] transition-colors">{item.name}</span>
                      <span className="text-[11px] font-semibold text-[#a1a1a6] mt-0.5">{item.arabic}</span>
                    </div>
                    {item.price && (
                      <span className="font-serif text-white text-[13px] md:text-sm font-bold tracking-widest whitespace-nowrap pl-3">{item.price}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Sandwiches => Reduced margins, fonts, and circle prices */}
            {section.type === "sandwiches" && (
              <div className="grid grid-cols-2 gap-4 text-center max-w-lg mx-auto mb-6 relative z-10">
                {section.items.map((item, iIndex) => (
                  <div key={iIndex} className="py-2 border-b border-dashed border-[#5a5a60] last:border-b-0 hover:bg-[#46464a]/50 rounded-lg transition-colors">
                    <span className="block font-bold text-white text-xs md:text-sm tracking-wide">{item.name}</span>
                    <span className="block text-[10px] font-semibold text-[#a1a1a6] mt-0.5">{item.arabic}</span>
                  </div>
                ))}

                {/* Reduced size Pricing Bubbles with Maroon Set */}
                <div className="col-span-2 flex items-center justify-center gap-6 mt-6">
                  <div className="bg-[#8C231F] text-white w-20 h-20 rounded-full flex flex-col items-center justify-center text-[10px] font-bold shadow-[0_10px_20px_rgba(140,35,31,0.4)] border-[3px] border-[#5a5a60] transform hover:scale-105 transition-transform">
                    <span className="text-sm border-b border-white/20 pb-0.5 w-8 text-center mb-0.5">Large</span>
                    <span className="tracking-widest">1.575</span>
                  </div>
                  <div className="bg-[#46464a] text-white w-16 h-16 rounded-full flex flex-col items-center justify-center text-[9px] font-bold shadow-md border-[2px] border-[#5a5a60] transform hover:scale-105 hover:border-[#8C231F] transition-all">
                    <span className="text-[10px] border-b border-[#a1a1a6] pb-0.5 w-6 text-center mb-0.5">Small</span>
                    <span className="tracking-widest">1.260</span>
                  </div>
                </div>
              </div>
            )}

            {/* Burgers => Compact layout */}
            {section.type === "burgers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2 relative z-10 max-w-4xl mx-auto">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row justify-between items-center bg-[#46464a]/50 p-4 rounded-2xl border border-[#5a5a60] gap-4 text-center md:text-left shadow-sm hover:border-[#8C231F] transition-colors">
                    <div>
                      <span className="block font-bold text-white whitespace-pre-line text-[13px] md:text-sm tracking-wide leading-relaxed">{item.name}</span>
                      <span className="block text-[11px] font-semibold text-[#a1a1a6] whitespace-pre-line mt-1 leading-relaxed">{item.arabic}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="border border-[#5a5a60] bg-[#3e3e42] text-[#d8d8dc] px-3 py-1.5 rounded-lg text-[9px] font-bold whitespace-pre-line text-center shadow-sm">
                        <span className="uppercase tracking-widest block mb-0.5">Burger Only</span>
                        <span className="text-white tracking-widest text-[11px]">{item.burgerOnly.replace(" OMR", "")}</span>
                      </div>
                      <div className="bg-[#8C231F] text-white rounded-full w-14 h-14 flex items-center justify-center text-[11px] font-bold whitespace-pre-line text-center shadow-[0_8px_16px_rgba(140,35,31,0.4)] border-[2px] border-[#5a5a60]">
                        {item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Graphics layout for list sections (Sandwiches, combos, lists) => Slightly reduced height */}
            {(section.type === "list" || section.type === "sandwiches" || section.type === "burgers") && section.footerKey && getImage(section.footerKey) && (
              <div className="mt-8 flex justify-center w-full relative z-10">
                <div className="w-full max-w-xl h-32 md:h-48 bg-[#2a2a2d] rounded-2xl overflow-hidden shadow-inner border border-[#5a5a60] relative flex items-center justify-center">
                  <img src={getImage(section.footerKey)} alt={`${section.category} visual`} className="h-full w-full object-cover filter saturate-105 transition-transform duration-700 hover:scale-105 opacity-80" />
                </div>
              </div>
            )}

          </motion.section>
        ))}

      </div>
    </div>
  );
};

export default Menu;
