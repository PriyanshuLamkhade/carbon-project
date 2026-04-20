"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "../ui/Button";
import Link from "next/link";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef        = useRef<HTMLDivElement>(null);
  const logoRef       = useRef<HTMLHeadingElement>(null);
  const linksRef      = useRef<HTMLButtonElement[]>([]);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── entrance animation (once on mount) ── */
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.9 });
    tl.fromTo(navRef.current,
        { y: -60, opacity: 0 },
        { y: 0,   opacity: 1, duration: 0.7, ease: "expo.out" })
      .fromTo(logoRef.current,
        { x: -20, opacity: 0 },
        { x: 0,   opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, "-=0.3")
      .fromTo(linksRef.current,
        { y: -10, opacity: 0 },
        { y: 0,   opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.07 }, "-=0.25")
      .fromTo(ctaRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1,    opacity: 1, duration: 0.4, ease: "back.out(1.8)" }, "-=0.2");
  }, {});

  /* ── mobile menu slide ── */
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (menuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "expo.out" });
    } else {
      gsap.to(mobileMenuRef.current,
        { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [menuOpen]);

  const handleScrollTo = (id: string) => {
    setMenuOpen(false);
    if (id === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = ["Home", "About", "Features", "FAQ", "Contact"];

  return (
    <div className="px-4 pt-4">
      {/* ── Desktop nav ── */}
      <div
        ref={navRef}
        className={`hidden sm:flex items-center justify-between py-3.5 px-6 rounded-2xl
                    transition-all duration-500 ease-in-out
                    ${scrolled
                      ? "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-lg shadow-black/20"
                      : "bg-transparent border border-transparent"
                    }`}
      >
        {/* Logo */}
        <h1
          ref={logoRef}
          onClick={() => handleScrollTo("Home")}
          className="text-white text-2xl font-black tracking-tight cursor-pointer select-none group"
        >
          Layer
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 group-hover:from-emerald-300 group-hover:to-blue-300 transition-all duration-300">
            Zero
          </span>
        </h1>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map((item, i) => (
            <button
              key={item}
              ref={(el) => { if (el) linksRef.current[i] = el; }}
              onClick={() => handleScrollTo(item)}
              type="button"
              className="relative px-4 py-2 text-white/70 hover:text-white text-sm font-medium
                         transition-colors duration-200 rounded-lg hover:bg-white/5 group"
            >
              {item}
              {/* underline */}
              <span className="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full
                               bg-emerald-400 scale-x-0 group-hover:scale-x-100
                               transition-transform duration-300 origin-left" />
            </button>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef}>
          <Link href="/sign-in">
            <button className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400
                               text-white text-sm font-semibold tracking-wide
                               transition-all duration-300 hover:scale-105
                               shadow-md shadow-emerald-500/25 hover:shadow-emerald-400/40">
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* ── Mobile nav ── */}
      <div
        className={`sm:hidden flex items-center justify-between py-3 px-5 rounded-2xl
                    transition-all duration-500
                    ${scrolled
                      ? "bg-black/40 backdrop-blur-2xl border border-white/10"
                      : "bg-transparent border border-transparent"
                    }`}
      >
        <h1
          onClick={() => handleScrollTo("Home")}
          className="text-white text-xl font-black tracking-tight cursor-pointer"
        >
          Layer<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Zero</span>
        </h1>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 group"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.5px] bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        ref={mobileMenuRef}
        className="sm:hidden overflow-hidden h-0 opacity-0"
      >
        <div className="mx-0 mt-1 bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleScrollTo(item)}
              className="text-left text-white/80 hover:text-white text-sm font-medium
                         px-4 py-3 rounded-xl hover:bg-white/5 transition-colors duration-200"
            >
              {item}
            </button>
          ))}
          <Link href="/sign-in" className="mt-2">
            <button className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400
                               text-white text-sm font-semibold tracking-wide transition-all duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};