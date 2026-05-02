import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { menuImageApi } from "../services/api";

// imageMap is fetched from backend as: { "PIZZA": "https://signed-url...", ... }
// Keys are uppercase, trimmed. Lookup is done case-insensitively.

const menuData = [
  {
    category: "SALADS", type: "grid",
    items: [
      { name: "RUSSIAN SALAD", price: "1.500 OMR", imageKey: "RUSSIAN SALAD" },
      { name: "Greek Salad", price: "1.785 OMR", imageKey: "Greek Salad" },
      { name: "Arabic Salad", price: "1.575 OMR", imageKey: "Arabic Salad" },
      { name: "Shirazi Salad", price: "1.785 OMR", imageKey: "Shirazi Salad" },
      { name: "Fattoush", price: "1.785 OMR", imageKey: "Fattoush" },
      { name: "Mixed Salad with Bread", price: "2.835 OMR", imageKey: "Mixed Salad with Bread" },
      { name: "Hummus with Bread", price: "1.575 OMR", imageKey: "Hummus with Bread" },
      { name: "Mutabal with Bread", price: "1.575 OMR", imageKey: "Mutabal with Bread" },
      { name: "Vine Leaves", price: "1.890 OMR", imageKey: "Vine Leaves" },
      { name: "Mast Cucumber", price: "1.365 OMR", imageKey: "Mast Cucumber" },
      { name: "Lentil Soup with Bread", price: "1.785 OMR", imageKey: "Lentil Soup with Bread" },
      { name: "Falodeh", price: "1.680 OMR", imageKey: "Falodeh" }
    ]
  },
  {
    category: "Meals with Rice & 2 Skewers", type: "grid_rectangle",
    items: [
      { name: "Kabab Chicken", price: "4.095 OMR", imageKey: "Kabab Chicken" },
      { name: "Kabab Lamb", price: "4.095 OMR", imageKey: "Kabab Lamb" },
      { name: "Shish Tawook", price: "4.305 OMR", imageKey: "Shish Tawook" },
      { name: "Lamb Chops", price: "5.880 OMR", imageKey: "Lamb Chops" },
      { name: "Shish Tawook / Lamb Yoghurt", price: "4.410 OMR", imageKey: "Shish Tawook Lamb Yoghurt" },
      { name: "Lamb Yoghurt", price: "4.410 OMR", imageKey: "Lamb Yoghurt" },
      { name: "Chicken Yoghurt", price: "4.305 OMR", imageKey: "Chicken Yoghurt" },
      { name: "Kabab Mix", price: "4.095 OMR", imageKey: "Kabab Mix" },
      { name: "Tandoori Chicken", price: "4.305 OMR", imageKey: "Tandoori Chicken" },
      { name: "Grilled Fish Fillet", price: "4.725 OMR", imageKey: "Grilled Fish Fillet" },
      { name: "Joojeh Tikka", price: "4.725 OMR", imageKey: "Joojeh Tikka" },
      { name: "Lamb Tikka", price: "4.410 OMR", imageKey: "Lamb Tikka" },
      { name: "Bakhtiari Kabab", price: "5.040 OMR", imageKey: "Bakhtiari Kabab" },
      { name: "Charcoal Chicken", price: "3.990 OMR", imageKey: "Charcoal Chicken" },
      { name: "Sultani Steak", price: "5.040 OMR", imageKey: "Sultani Steak" },
      { name: "Burberry Rice", price: "1.680 OMR", imageKey: "Burberry Rice" },
      { name: "Saffron Rice", price: "1.260 OMR", imageKey: "Saffron Rice" },
      { name: "White Rice", price: "1.050 OMR", imageKey: "White Rice" },
    ]
  },
  {
    category: "Meal Platters", type: "platters",
    items: [
      { name: "Family Meal Combo", price: "10.000 OMR", fullWidth: true, imageKey: "Family Meal Combo" },
      { name: "Meal for Three Combo", price: "9.000 OMR", fullWidth: true, imageKey: "MEAL-FOR-THREE-COMBO" },
      { name: "Meal for Two Combo", price: "8.000 OMR", fullWidth: true, imageKey: "Meal for Two Combo" },
      { name: "Full Lamb", price: "", imageKey: "Full Lamb" },
      { name: "Mix BBQ With Rice For 4 Person", price: "9.500 OMR", imageKey: "Mix BBQ With Rice For 4 Person" },
      { name: "BBQ Family Jumbo", price: "6.000 OMR", imageKey: "BBQ Family Jumbo" },
      { name: "Bukhari Rice with Shawaya", price: "4.000 OMR", imageKey: "Bukhari Rice with Shawaya 3 Persons" },
    ]
  },
  {
    category: "Meals with Bread & 2 Skewers", type: "list", footerKey: "Meals with Bread & 2 Skewers",
    items: [
      { name: "Kabab Chicken / Chicken Yoghurt", price: "4.410 OMR" },
      { name: "Kabab Mix", price: "4.410 OMR" },
      { name: "Tandoori Chicken / Shish Tawook", price: "4.410 OMR" },
      { name: "Mixed Kabab / Tika Combo", price: "5.775 OMR" },
      { name: "Lamb Tikka / Chicken Yoghurt", price: "4.620 OMR" },
      { name: "Lamb Tikka / Joojeh", price: "4.935 OMR" },
    ]
  },
  {
    category: "Meals with Rice & 1 Skewer", type: "list", footerKey: "MEALS-WITH-RICE-&-1-SKEWER",
    items: [
      { name: "Kabab Chicken", price: "3.045 OMR" },
      { name: "Joojeh Tikka", price: "3.255 OMR" },
      { name: "Kabab Lamb", price: "3.045 OMR" },
      { name: "Lamb Tikka", price: "3.255 OMR" },
      { name: "Shish Tawook", price: "3.045 OMR" },
      { name: "Kofta Kabab", price: "3.045 OMR" },
      { name: "Tandoori Chicken", price: "3.045 OMR" },
      { name: "Lamb Yoghurt", price: "3.255 OMR" },
      { name: "Chicken Yoghurt", price: "3.045 OMR" },
    ]
  },
  {
    category: "Meal with Tandoori Bread 1 Skewer", type: "list", footerKey: "MEAL-WITH-TANDOORI-BREAD-1-SKEWER",
    items: [
      { name: "Joojeh Tikka", price: "3.570 OMR" },
      { name: "Chicken Yoghurt", price: "3.465 OMR" },
      { name: "Tandoori Chicken", price: "3.360 OMR" },
      { name: "Kabab Lamb", price: "3.360 OMR" },
      { name: "Shish Tawook", price: "3.360 OMR" },
      { name: "Lamb Tikka", price: "3.570 OMR" },
      { name: "Kabab Chicken", price: "3.360 OMR" },
      { name: "Lamb Yoghurt", price: "3.570 OMR" },
    ]
  },
  {
    category: "Grilled Sandwiches", type: "sandwiches", footerKey: "GRILLED-SANDWICHES",
    items: [
      { name: "Kabab Lamb" },
      { name: "Tandoori Chicken" },
      { name: "Kabab Chicken" },
      { name: "Lamb Tikka" },
      { name: "Shish Tawook" },
      { name: "Chicken Yoghurt" },
    ]
  },
  {
    category: "Grilled Burgers", type: "burgers", footerKey: "GRILLED-BURGERS",
    items: [
      { name: "Grilled Lamb Burger\nwith fries and drink", price: "2.100\nOMR", burgerOnly: "1.785\nOMR" },
      { name: "Grilled Chicken Burger\nwith fries and drink", price: "1.785\nOMR", burgerOnly: "1.680\nOMR" },
    ]
  },
  {
    category: "TASTY BITES CORNER", type: "grid",
    items: [
      { name: "CHICKEN TIKKA POROTTA", price: "0.800 OMR", imageKey: "CHICKENBEEF TIKKA" },
      { name: "BURGER", price: "1.000 OMR", imageKey: "GRILLED BURGERS" },
      { name: "PIZZA", price: "1.500 / 2.000 OMR", imageKey: "CHICKEN PIZZA" },
      { name: "JIBIN", price: "0.600 OMR", imageKey: "JIBEN" },
      { name: "FALAFEL SANDWICH", price: "0.300 OMR", imageKey: "FALAFEL SANDWICH" },
      { name: "CHEESE POROTTA", price: "0.400 OMR", imageKey: "CHEESE POROTTA" },
      { name: "FRANCISCO SANDWICH", price: "0.600 OMR", imageKey: "FRANCISCO SANDWICH" },
      { name: "OMELETTE POROTTA", price: "0.300 OMR", imageKey: "OMELETTE POROTTA" },
      { name: "FRIES POROTTA", price: "0.400 OMR", imageKey: "FRIES POROTTA" },
      { name: "CHICKEN CHILLY POROTTA", price: "0.500 OMR", imageKey: "CHICKEN CHILLY POROTTA" },
      { name: "NUTELLA POROTTA", price: "0.400 OMR", imageKey: "NUTELLA POROTTA" }
    ]
  },
  {
    category: "MADEENA SPECIAL", type: "grid",
    items: [
      { name: "CHICKEN NAALUKETTU", price: "1.400 OMR", imageKey: "CHICKEN NAALU KETT" },
      { name: "CHICKEN KUMMATTI", price: "1.200 OMR", imageKey: "CHICKEN KUMMATTI" },
      { name: "SEA STACK", price: "4.500 OMR", imageKey: "KADAL KOOMBARAM" },
      { name: "BEEF CHERIYULLI ULATH", price: "1.400 OMR", imageKey: "BEEF CHERIYULLI ULATH" },
      { name: "VANCHIKOOT MILK CHEMEEN", price: "1.500 OMR", imageKey: "VANJIKKOOTTPAAL CHEMMEEN" },
      { name: "KOONTHAL GHEE VARATT", price: "1.500 OMR", imageKey: "KOONTHAL NEYY VARATT" },
      { name: "IFFA CHICKEN", price: "1.800 OMR", imageKey: "IFFA CHICKEN" },
      { name: "MADEENA CHICKEN FRY", price: "1.200 OMR", imageKey: "MADEENA CHICKEN FRY" },
      { name: "VENAAD CHICKEN MASALA", price: "1.300 OMR", imageKey: "VENAD CHICKENMASALA" },
      { name: "CHICKEN PILATH", price: "1.400 OMR", imageKey: "CHICKEN PILAATH" },
      { name: "WAYANAD NAND ROAST", price: "1.700 OMR", imageKey: "VENAD NANDU ROAST" },
      { name: "BEEF LIVER DRIED", price: "1.500 OMR", imageKey: "BEEF LIVER VARATT" },
      { name: "PUTT BIRYANI", price: "1.300 OMR", imageKey: "PUTT BIRIYANI ( BEEFCHICKEN)" },
      { name: "CHICKEN PASTA", price: "2.200 OMR", imageKey: "CHICKEN PASTHA" },
      { name: "BEEF KUMBANKOOTTULARTH", price: "2.000 OMR", noImage: true },
      { name: "SAATHAR", price: "0.600 OMR", noImage: true },
      { name: "NEKKALAK", price: "0.500 OMR", noImage: true }
    ]
  },
  {
    category: "SOUP", type: "grid",
    items: [
      { name: "SWEET CORN SOUP CHICKEN", price: "0.800 OMR", imageKey: "SWEET CORN SOUPCHICKEN" },
      { name: "SWEET CORN SOUP VEG", price: "0.800 OMR", imageKey: "SWEET CORN SOUP VEG" },
      { name: "CHICKEN CLEAR SOUP", price: "0.500 / 0.600 OMR", imageKey: "CHICKEN CLEAR SOUP" },
      { name: "VEG CLEAR SOUP", price: "0.500 / 0.600 OMR", imageKey: "VEG CLEAR SOUP" }
    ]
  },
  {
    category: "MEAT & FISH CORNER", type: "grid",
    items: [
      { name: "CHICKEN LOLIPOP", price: "1.400 OMR", imageKey: "CHICKEN LOLIPOP" },
      { name: "CHICKEN WINGS", price: "1.200 OMR", imageKey: "CHICKENWINGS" },
      { name: "MILK POROTTA", price: "1.400 OMR", imageKey: "MILK POROTTA IMAGE" },
      { name: "CHATTI POROTTA", price: "1.400 OMR", imageKey: "CHATTI POROTTA(BEEFCHICKE)" },
      { name: "KIZHI POROTTA", price: "1.400 OMR", imageKey: "KIZHI POROTTA(BEEFCHICKE)" },
      { name: "PAAL KAPPA", price: "1.400 OMR", imageKey: "PAAL KAPPA" },
      { name: "KAPPA KADAL KOOTT", price: "2.000 OMR", imageKey: "KAPPA KADAL KOOTT" },
      { name: "BRAIN FRY", price: "1.600 OMR", imageKey: "BRAIN FRY" },
      { name: "KALLUMAKKAYA", price: "2.000 OMR", imageKey: "KALLUMAKAY" },
      { name: "FISH POLLICHAD", price: "AS PER SIZE", imageKey: "FISH POLLICHAD" },
      { name: "FISH RAW MANGO POLLICHAD", price: "AS PER SIZE", imageKey: "FISH RAW MANGO POLLICHAD" },
      { name: "KADA EGG", price: "1.200 OMR", imageKey: "KAADAMUTTA ROAST" },
      { name: "MONJATHI CHICKEN", price: "3.200 OMR", imageKey: "MONJATHI KOZHI" },
      { name: "PUTHIYPLA CHICKEN", price: "3.000 OMR", imageKey: "PUTHIYPLA CHICKEN" },
      { name: "MALABAR VEG KURUMA", price: "0.600 OMR", imageKey: "MALABAR VEG KURUMA" },
      { name: "Veg stew", price: "0.700 OMR", imageKey: "Veg stew" },
      { name: "Veg Kadai", price: "0.800 OMR", imageKey: "Veg Kadai" },
      { name: "GOPI MANCHURI", price: "1.100 OMR", imageKey: "GOPI MANCHURI" },
      { name: "GOBI 65", price: "1.100 OMR", imageKey: "GOBI 65" },
      { name: "ANGAMALI MANGO CURRY", price: "0.700 OMR", imageKey: "ANGAMALIMANGO CURRY" },
      { name: "MUSHROOM MASALA", price: "1.000 OMR", imageKey: "MUSHROOMMASALA" },
      { name: "PANEER KADAI", price: "1.000 OMR", imageKey: "PANEER KADAI" },
      { name: "GOBI CHILLY", price: "1.200 OMR", imageKey: "GOBI CHILLY" }
    ]
  },
  {
    category: "STARTER", type: "grid",
    items: [
      { name: "FISH NELLIKA CURRY", price: "AS PER SIZE", imageKey: "FISH NELLIKA CURRY" },
      { name: "PRAWNS TAWA FRY", price: "1.700 OMR", imageKey: "PRAWNS THAWA FRY" },
      { name: "KAADA FRY", price: "1.300 OMR", imageKey: "KAADA FRY" },
      { name: "MUSHROOM PEPPER DRY", price: "1.200 OMR", imageKey: "MUSHROOMPEPPER DRY" },
      { name: "CRISPY FRIED VEG", price: "1.000 OMR", imageKey: "CRISPY FRIED VEG" }
    ]
  },
  {
    category: "CURRIES & FRIES", type: "grid",
    items: [
      { name: "BEEF PAAL CURRY", price: "1.400 OMR", imageKey: "BEEF PAAL CURRY" },
      { name: "VARUTHARACHA CURRY", price: "1.200 OMR", imageKey: "VARUTHARACHA CURRY" },
      { name: "BUTTER CHICKEN CURRY", price: "1.400 OMR", imageKey: "BUTTER CHICKEN CURRY" },
      { name: "BOTI", price: "1.500 OMR", imageKey: "BOTI" },
      { name: "LIVER FRY", price: "1.500 OMR", imageKey: "LIVER FRY" },
      { name: "KIDNEY FRY", price: "1.500 OMR", imageKey: "KIDNEY FRY" }
    ]
  },
  {
    category: "DESSERTS", type: "grid",
    items: [
      { name: "KUNAFA WITH ICE CREAM", price: "2.500 OMR", imageKey: "KUNAFA WITH ICE CREAM" },
      { name: "FRUIT SALAD WITH ICE CREAM", price: "1.500 OMR", imageKey: "FRUIT SALAD WITH ICE CREAM" },
      { name: "Kunafa With Iranian Tea", price: "2.310 OMR", imageKey: "Kunafa With Iranian Tea" },
      { name: "KUNAFA", price: "2.100 OMR", imageKey: "KUNAFA" }
    ]
  },
  {
    category: "SIGNATURE RICE & BIRIYANI", type: "grid",
    items: [
      { name: "MALABAR CHICKEN DUM BIRYANI", price: "1.200 OMR", imageKey: "MALABAR CHICKEN DUM BIRIYANI" },
      { name: "MANDI RICE (CHICKEN)", price: "QTR 1.400\nHALF 2.600\nOMR", imageKey: "MANDHI RICE (CHICKEN)" },
      { name: "HYDERABAD CHICKEN BIRYANI", price: "1.300 OMR", imageKey: "HYDERABAD CHICKEN BIRYANI" },
      { name: "HYDERABAD MUTTON BIRYANI", price: "1.700 OMR", imageKey: "HYDERABAD MUTTON BIRYANI" },
      { name: "HYDERABAD BEEF BIRYANI", price: "1.500 OMR", imageKey: "HYDERABAD BEEF BIRYANI" },
      { name: "BUKHARI RICE", price: "1.800 OMR", imageKey: "BUKHARI RICE" }
    ]
  },
  {
    category: "SIGNATURE ROAST SPECIALS", type: "grid",
    items: [
      { name: "GOAT ROAST", price: "AS PER SIZE", imageKey: "GOAT ROAST" },
      { name: "MALABAR KADA ROAST", price: "AS PER SIZE", imageKey: "MALABAR KADA ROAST" },
      { name: "CRISPY ROASTED DUCK", price: "AS PER SIZE", imageKey: "CRISPY ROASTED DUCK" },
      { name: "RABBIT ROAST", price: "2.500 OMR", imageKey: "RABBIT ROAST" },
      { name: "CAMEL ROAST", price: "2.200 OMR", imageKey: "CAMEL ROAST" },
      { name: "DEER ROAST", price: "AS PER SIZE", imageKey: "DEER ROAST" },
      { name: "WAYANADIN POTHUM KAAL", price: "AS PER SIZE", imageKey: "WAYANADIN POTHUM KAAL" },
      { name: "KATTU POTHU ROAST", price: "AS PER SIZE", imageKey: "KATTU POTHU ROAST" }
    ]
  },
  {
    category: "TEA & COFFEE", type: "grid",
    items: [
      { name: "KADAKK", price: "0.100 OMR", imageKey: "KADAKK" },
      { name: "LIPTON", price: "0.100 OMR", imageKey: "LIPTON" },
      { name: "AFMAR (BLACK TEA)", price: "0.100 OMR", imageKey: "AFMAR (BLACK TEA)" },
      { name: "CAPPUCCINO", price: "0.800 OMR", imageKey: "CAPPUCCINO" },
      { name: "NESCAFE COFFEE", price: "0.500 OMR", imageKey: "NESCAFE COFFEE" },
      { name: "IRANI CHAYA", price: "1.000 OMR", imageKey: "IRANI CHAYA" },
      { name: "TURKISH COFFEE", price: "1.500 OMR", imageKey: "TURKISH COFFEE" },
      { name: "Zachar Tea", price: "0.300 OMR", noImage: true },
      { name: "Ali jafra milk", price: "0.500 OMR", noImage: true },
      { name: "Alba Tea", price: "0.500 OMR", noImage: true },
      { name: "Shalib", price: "1.500 OMR", noImage: true }
    ]
  },
  {
    category: "FRESH JUICES & SHAKES", type: "grid",
    items: [
      { name: "KINDER JOY SHAKE", price: "1.000 / 1.300 OMR", imageKey: "KINDER JOY SHAKE" },
      { name: "KITKAT SHAKE", price: "1.000 / 1.300 OMR", imageKey: "KITKAT SHAKE" },
      { name: "SNICKERS SHAKE", price: "1.000 / 1.300 OMR", imageKey: "SNICKERS SHAKE" },
      { name: "OREO SHAKE", price: "1.000 / 1.300 OMR", imageKey: "OREO SHAKE" },
      { name: "VANILLA SHAKE", price: "1.000 / 1.300 OMR", imageKey: "VANILLA SHAKE" },
      { name: "GALAXY SHAKE", price: "1.000 / 1.300 OMR", imageKey: "GALAXY SHAKE" },
      { name: "MOCHHA MILKSHAKE", price: "1.000 / 1.300 OMR", imageKey: "MOCHHA MILKSHAKE" },
      { name: "PINEAPPLE JUICE", price: "0.800 / 1.000 OMR", imageKey: "PINEAPPLE JUICE" },
      { name: "ORANGE JUICE", price: "0.800 / 1.000 OMR", imageKey: "ORANGE JUICE" },
      { name: "POMEGRANATE", price: "0.800 / 1.000 OMR", imageKey: "POMEGRANTE" },
      { name: "MADHEENA COCKTAIL", price: "0.700 / 0.900 OMR", imageKey: "MADHEENA COCKTAIL" },
      { name: "SWEET MELON", price: "0.600 / 0.800 OMR", imageKey: "SWEET MELON" },
      { name: "MANGO SHAKE", price: "1.000 / 1.300 OMR", imageKey: "MANGO SHAKE" },
      { name: "BANANA SHAKE", price: "0.600 / 0.900 OMR", imageKey: "BANANA SHAKE" },
      { name: "WATERMELON JUICE", price: "0.800 / 1.000 OMR", imageKey: "WATERMELON JUICE" },
      { name: "LEMON MINT", price: "0.500 / 0.800 OMR", imageKey: "LEMON MINT" },
      { name: "FALOODA", price: "0.800 / 1.200 OMR", imageKey: "FALOODA" },
      { name: "MIX ICE CREAM", price: "0.600 / 1.100 OMR", imageKey: "MIX ICE CREAM" },
      { name: "AVOCADO", price: "0.800 / 1.100 OMR", imageKey: "AVOCADO" },
      { name: "BLUEBERRY", price: "0.800 / 1.000 OMR", imageKey: "BLUEBERRY" },
      { name: "PAPPAYA", price: "0.700 / 1.000 OMR", imageKey: "PAPPAYA" },
      { name: "KIWI", price: "0.700 / 0.900 OMR", imageKey: "KIWI" },
      { name: "STRAWBERRY MILKSHAKE", price: "1.000 / 1.300 OMR", imageKey: "STRAWBERRY MILKSHAKE" }
    ]
  },
  {
    category: "MOJITOS & JUICES", type: "grid",
    items: [
      { name: "PASSION FRUIT JUICE", price: "0.800 / 1.000 OMR", imageKey: "PASSION FRUIT JUICE" },
      { name: "LEMON MINT MOJITO", price: "0.800 / 1.100 OMR", imageKey: "LEMON MINT MOJITO" },
      { name: "STRAWBERRY MOJITO", price: "0.800 / 1.100 OMR", imageKey: "STRAWBERRY MOJITO" },
      { name: "BLUEBERRY MOJITO", price: "0.800 / 1.100 OMR", imageKey: "BLUEBERRY MOJITO" },
      { name: "PASSION MOJITO", price: "0.800 / 1.100 OMR", imageKey: "PASSION MOJITO" },
      { name: "WATERMELON MOJITO", price: "0.800 / 1.100 OMR", imageKey: "WATERMELON MOJITO" },
      { name: "APPLE MOJITO", price: "0.800 / 1.100 OMR", imageKey: "APPLE MOJITO" },
      { name: "PINEAPPLE MOJITO", price: "0.800 / 1.100 OMR", imageKey: "PINEAPPLE MOJITO" },
      { name: "ROOB RUMAN", price: "1.000 / 1.300 OMR", noImage: true },
      { name: "ROOB MANGO", price: "1.000 / 1.300 OMR", noImage: true },
      { name: "ROOB STRAWBERRY", price: "1.000 / 1.300 OMR", noImage: true },
      { name: "ROOB BLUEBERRY", price: "1.000 / 1.300 OMR", noImage: true },
      { name: "ABOODI", price: "0.600 / 1.100 OMR", noImage: true },
      { name: "ABOODI SPL", price: "0.800 / 1.200 OMR", noImage: true },
      { name: "SHIFANA", price: "0.800 / 1.200 OMR", noImage: true },
      { name: "HAFEETY", price: "0.800 / 1.200 OMR", noImage: true },
      { name: "BURJ AL ARAB", price: "1.000 / 1.200 OMR", noImage: true },
      { name: "COCKTAIL FRUIT SLICE", price: "1.000 / 1.200 OMR", noImage: true }
    ]
  },
  {
    category: "GRILL & BBQ SPECIALS", type: "grid",
    items: [
      { name: "MUTTON RIBS", price: "3.200 OMR", imageKey: "MUTTON RIBS" },
      { name: "MIXED GRILL", price: "AS PER SIZE", imageKey: "MIXED GRILL" },
      { name: "MASALA SHAWAYA", price: "3.000 OMR", imageKey: "MASALA SHAWAYA" }
    ]
  }
];

const Menu = () => {
  const cached = menuImageApi.getCache();
  const [imageMap, setImageMap] = useState(cached || {});
  const [imagesLoading, setImagesLoading] = useState(!cached);

  // Lookup helper: normalise imageKey to uppercase and search the map
  const getImage = (key) => {
    if (!key || !imageMap) return null;
    const upperKey = key.trim().toUpperCase();
    return imageMap[upperKey] || null;
  };

  useEffect(() => {
    menuImageApi.getAll()
      .then(({ data }) => {
        setImageMap(data);
      })
      .catch((err) => console.warn('Menu images could not be fetched:', err.message))
      .finally(() => setImagesLoading(false));
  }, []);

  return (
    // Premium elegant dark-slate grey outer background theme
    <div className="bg-[#2a2a2d] text-white font-sans selection:bg-[#8C231F] selection:text-white pb-24">

      {/* 
        Hero Section: Majestic Full Screen Height
      */}
      <div className="relative w-full h-[70vh] md:h-[85vh] p-4 md:p-6 lg:p-8">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#4a4a50] bg-black">
          <Navbar transparent={true} />

          {getImage("MENU") && (
            <img
              src={getImage("MENU")}
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
                          <span className="tracking-widest">{item.name}</span>
                        </div>
                      ) : (
                        <div className="relative mb-4 w-36 h-36 md:w-40 md:h-40 mx-auto bg-white rounded-2xl flex items-center justify-center border-[3px] border-[#4a4a50] shadow-xl overflow-visible group-hover:scale-105 group-hover:shadow-2xl group-hover:border-[#8C231F] transition-all duration-500">
                          <img src={imageSrc} alt={item.name} className="object-contain p-2 rounded-[1rem] w-full h-full" />
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
                        <span className="text-[10px] md:text-xs font-bold text-[#a1a1a6] leading-tight uppercase tracking-wider">{item.name}</span>
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
                      <div className="relative mb-4 w-36 h-36 md:w-40 md:h-40 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-visible border-[3px] border-[#4a4a50] group-hover:border-[#8C231F] group-hover:shadow-[0_15px_30px_rgba(140,35,31,0.3)] transition-all duration-500">
                        {imageSrc ? (
                          <img src={imageSrc} alt={item.name} className="object-contain p-2 rounded-[1rem] w-full h-full group-hover:opacity-90 transition-opacity" />
                        ) : (
                          <span className="text-[#636368] text-[10px] uppercase tracking-widest font-bold">Image Coming Soon</span>
                        )}
                        {item.price && (
                          <div className="absolute -bottom-3 -right-3 bg-[#8C231F] text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-[9px] md:text-[10px] shadow-lg whitespace-pre-line leading-tight transform group-hover:scale-110 transition-transform">
                            {item.price.replace(" ", "\n")}
                          </div>
                        )}
                      </div>
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
