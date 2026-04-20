import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef   = useRef<HTMLElement>(null);
  const topRowRef   = useRef<HTMLDivElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const TA = "play reverse play reverse";

    gsap.fromTo(topRowRef.current,
      { y: 40, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 88%", toggleActions: TA } });

    gsap.fromTo(dividerRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 85%", toggleActions: TA } });

    gsap.fromTo(linksRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 83%", toggleActions: TA } });

    gsap.fromTo(bottomRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5,
        scrollTrigger: { trigger: footerRef.current, start: "top 80%", toggleActions: TA } });
  }, { scope: footerRef });

  const navLinks = ["About", "Features", "FAQ", "Contact"];

  const socials = [
    {
      label: "Twitter / X",
      href: "#",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.23H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: "#",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: "mailto:support@layerzero.eco",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v2l-10 6L2 6V4zm0 4v10a2 2 0 002 2h16a2 2 0 002-2V8l-10 6L2 8z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-b from-gray-950 to-emerald-950 overflow-hidden"
    >
      {/* mesh glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.10) 0%, transparent 55%)",
        }}
      />
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 72px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 72px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* ── Top row ── */}
        <div
          ref={topRowRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
        >
          {/* Brand */}
          <div>
            <h3 className="text-white text-2xl font-black tracking-tight mb-3">
              Layer<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Zero</span>
            </h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Empowering ecological restoration with blockchain transparency and community-driven impact.
            </p>

            {/* mini stat chips */}
            <div className="flex gap-3 mt-5 flex-wrap">
              {[["🌿", "12K+ ha"], ["✅", "340+ projects"], ["🌍", "50+ NGOs"]].map(([emoji, label]) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium
                             bg-white/5 border border-white/10 text-white/60
                             rounded-full px-3 py-1"
                >
                  {emoji} {label}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white/30 text-xs font-semibold tracking-[0.18em] uppercase mb-5">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="group flex items-center gap-2 text-white/55 hover:text-white
                               text-sm transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-400/0 group-hover:bg-emerald-400
                                     transition-all duration-300" />
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/sign-in"
                  className="group flex items-center gap-2 text-white/55 hover:text-white
                             text-sm transition-colors duration-200"
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-400/0 group-hover:bg-emerald-400
                                   transition-all duration-300" />
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Socials */}
          <div>
            <p className="text-white/30 text-xs font-semibold tracking-[0.18em] uppercase mb-5">Connect</p>

            <div className="flex gap-3 mb-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10
                             flex items-center justify-center text-white/50
                             hover:bg-emerald-500/20 hover:border-emerald-400/40 hover:text-emerald-400
                             transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* newsletter teaser */}
            <p className="text-white/35 text-xs leading-relaxed max-w-[220px]">
              Want updates on verified projects and carbon markets?{" "}
              <a href="mailto:support@layerzero.eco"
                className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                Get in touch →
              </a>
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          ref={dividerRef}
          className="h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-7"
        />

        {/* ── Bottom row ── */}
        <div
          ref={bottomRef}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs"
        >
          <p>© {new Date().getFullYear()} LayerZero. All rights reserved.</p>

          {/* Solana badge */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-green-400" />
            <span className="text-white/40 text-[11px] font-medium">Powered by Solana</span>
          </div>

          <p>Built for a greener planet 🌍</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;