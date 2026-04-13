"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SplashScreen from "@/components/sections/SplashScreen";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Categories from "@/components/sections/Categories";
import Footer from "@/components/sections/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import SearchModal from "@/components/ui/SearchModal";
import PriceTicker from "@/components/ui/PriceTicker";

const MarketOverview = dynamic(
  () => import("@/components/sections/MarketOverview"),
  { ssr: false }
);
const AIForecast = dynamic(
  () => import("@/components/sections/AIForecast"),
  { ssr: false }
);
const HowItWorks = dynamic(
  () => import("@/components/sections/HowItWorks")
);
const CTA = dynamic(() => import("@/components/sections/CTA"));

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <SplashScreen onComplete={() => setSplashDone(true)} />
      {splashDone && (
        <div>
          <Navbar onSearchOpen={openSearch} />
          <SearchModal isOpen={searchOpen} onClose={closeSearch} />
          <main className="pb-24">
            <Hero />
            <Stats />
            <Categories />
            <MarketOverview />
            <AIForecast />
            <HowItWorks />
            <CTA />
          </main>
          <Footer />
          <PriceTicker />
          <ScrollToTop />
        </div>
      )}
    </>
  );
}
