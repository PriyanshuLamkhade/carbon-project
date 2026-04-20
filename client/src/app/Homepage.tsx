"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import {
  ShieldCheck, UserPlus, Workflow,
  Globe2, Zap, Database, Clock4, MapPin,
} from "lucide-react";
import Cards from "../components/ui/Cards";
import Link from "next/link";
import Footer from "../components/layout/Footer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const stats = [
  { value: "12K+", label: "Hectares Restored", icon: "🌿" },
  { value: "340+", label: "Verified Projects",  icon: "✅" },
  { value: "98%",  label: "Audit Accuracy",     icon: "🎯" },
  { value: "50+",  label: "Partner NGOs",        icon: "🤝" },
];

const cards = [
  {
    Key: 1, title: "How it Works", number: 1,
    subtext: "From field to blockchain",
    body: "Upload geo-tagged evidence, get it verified with satellite & drone data, and see it stored immutably on the blockchain.",
    icon: <Workflow size={35} />,
  },
  {
    Key: 2, title: "Verified Impact", number: 2,
    subtext: "Trust through transparency",
    body: "Every project shows real CO₂ reduction and tokenized credits, traceable from source to buyer with complete transparency.",
    icon: <ShieldCheck size={35} />,
  },
  {
    Key: 3, title: "Get Involved", number: 3,
    subtext: "Empowering communities & organizations",
    body: "Join as a community, NGO, or buyer — register projects, verify sites, or purchase trusted carbon credits.",
    icon: <UserPlus size={35} />,
  },
];

const faqs = [
  { q: "How does wallet-based login work?",    emoji: "🔐", a: "When you sign in, we generate a unique one-time nonce. You sign it using your wallet to prove ownership. Once verified, you're issued a secure session token stored in cookies." },
  { q: "What kind of projects can I submit?",  emoji: "🌱", a: "Any project focused on ecological restoration — mangrove planting, reforestation, soil regeneration, or wetland revival — along with evidence and geolocation." },
  { q: "Why should I use the blockchain?",     emoji: "🔗", a: "Logging verified restoration data on Solana creates an immutable record, ensuring transparency for funders, buyers, and governing bodies." },
  { q: "Who verifies the submitted data?",     emoji: "👥", a: "Platform administrators manually review submissions using uploaded images, satellite data, and field reports." },
  { q: "What happens after verification?",     emoji: "📈", a: "The verified area is recorded, status updated, and the record can optionally be written to the blockchain. You'll see it in your project history." },
];

const featureItems = [
  { icon: <MapPin size={17} />,      text: "Submit geo-tagged forms with restoration details & images" },
  { icon: <ShieldCheck size={17} />, text: "Admin review and satellite / drone-based verification" },
  { icon: <Database size={17} />,    text: "Track job creation (MGNREGA person-days) and community training" },
  { icon: <Zap size={17} />,         text: "Secure wallet login with nonce authentication flow" },
  { icon: <Globe2 size={17} />,      text: "Optional blockchain storage for verifiable transparency" },
  { icon: <Clock4 size={17} />,      text: "Full user history via historyId based tracking" },
];

const processSteps = [
  { n: "01", title: "Register & Connect",  desc: "Create your profile and connect your Solana wallet for secure, trustless identity.",              side: "left",  emoji: "🔗" },
  { n: "02", title: "Submit Project",      desc: "Fill geo-tagged forms with photos, species data, and site coordinates.",                          side: "right", emoji: "📍" },
  { n: "03", title: "Expert Verification", desc: "Admins cross-reference your submission against satellite imagery and field reports.",              side: "left",  emoji: "🛰️" },
  { n: "04", title: "Carbon Credit Mint",  desc: "Verified hectares are tokenized into tradeable credits on the Solana blockchain.",                 side: "right", emoji: "🪙" },
  { n: "05", title: "Trade & Impact",      desc: "Sell credits to verified buyers and track real-world ecological impact over time.",                side: "left",  emoji: "📈" },
];

/* ─────────────────────────────────────────────
   toggleActions for bidirectional animation:
   play when entering, reverse when leaving
───────────────────────────────────────────── */
const TA = "play reverse play reverse";

/* ─────────────────────────────────────────────
   Floating particles decoration
───────────────────────────────────────────── */
const Particles = () => (
  <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(16)].map((_, i) => (
      <span
        key={i}
        className="absolute rounded-full bg-emerald-400/15 animate-float-particle"
        style={{
          width:  `${8 + (i % 4) * 7}px`,
          height: `${8 + (i % 4) * 7}px`,
          left:   `${(i * 6.1) % 100}%`,
          top:    `${(i * 7.7) % 100}%`,
          animationDelay:    `${(i * 0.38) % 4}s`,
          animationDuration: `${5 + (i % 4) * 1.2}s`,
        }}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Homepage = () => {
  const containerRef = useRef(null);

  /* hero */
  const heroPanelRef   = useRef(null);
  const heroLineRef    = useRef(null);
  const heroTagRef     = useRef(null);
  const heroHeadingRef = useRef(null);
  const heroSubRef     = useRef(null);
  const heroBtnRef     = useRef(null);
  const heroBadgeRef   = useRef(null);
  const heroScrollRef  = useRef(null);

  /* stats */
  const statsRef     = useRef(null);
  const statItemsRef = useRef([]);

  /* cards */
  const cardsSectionRef = useRef(null);
  const cardsLabelRef   = useRef(null);
  const cardItemsRef    = useRef([]);

  /* about */
  const aboutRef        = useRef(null);
  const aboutTagRef     = useRef(null);
  const aboutTitleRef   = useRef(null);
  const aboutDividerRef = useRef(null);
  const aboutBodyRef    = useRef(null);
  const aboutCardsRef   = useRef([]);

  /* process */
  const processRef      = useRef(null);
  const processLabelRef = useRef(null);
  const processHeadRef  = useRef(null);
  const processLineRef  = useRef(null);
  const processItemsRef = useRef([]);

  /* features */
  const featuresRef      = useRef(null);
  const featuresPanelRef = useRef(null);
  const featuresLabelRef = useRef(null);
  const featuresHeadRef  = useRef(null);
  const featuresListRef  = useRef([]);

  /* faq */
  const faqRef      = useRef(null);
  const faqLabelRef = useRef(null);
  const faqHeadRef  = useRef(null);
  const faqItemsRef = useRef([]);

  /* contact */
  const contactRef       = useRef(null);
  const contactLabelRef  = useRef(null);
  const contactHeadRef   = useRef(null);
  const contactBodyRef   = useRef(null);
  const contactFormRef   = useRef(null);
  const contactInfoRef   = useRef([]);

  /* contact form state */
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus]   = useState("idle"); // idle | sending | sent | error

  useGSAP(() => {

    /* ══════════════════════════════════
       HERO — page-load timeline (no ST)
    ══════════════════════════════════ */
    gsap.timeline({ delay: 0.15 })
      .fromTo(heroPanelRef.current,
        { x: "-100%", opacity: 0 },
        { x: "0%",    opacity: 1, duration: 1.1, ease: "expo.out" })
      .fromTo(heroLineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.5,  ease: "power2.out" }, "-=0.5")
      .fromTo(heroTagRef.current,
        { y: 20, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.45 }, "-=0.1")
      .fromTo(heroHeadingRef.current.querySelectorAll(".hw"),
        { y: 70, opacity: 0, rotateX: -15 },
        { y: 0,  opacity: 1, rotateX: 0, duration: 0.65, ease: "back.out(1.5)", stagger: 0.07 }, "-=0.1")
      .fromTo(heroSubRef.current,
        { y: 20, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.5 }, "-=0.2")
      .fromTo(heroBtnRef.current,
        { y: 25, opacity: 0, scale: 0.88 },
        { y: 0,  opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, "-=0.15")
      .fromTo(heroBadgeRef.current,
        { x: 50, opacity: 0 },
        { x: 0,  opacity: 1, duration: 0.6, ease: "back.out(1.4)" }, "-=0.35")
      .fromTo(heroScrollRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");

    /* floating badge idle bob */
    gsap.to(heroBadgeRef.current, {
      y: -10, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1,
    });

    /* ══════════════════════════════════
       HELPER — bidirectional ScrollTrigger fromTo
       toggleActions "play reverse play reverse"
       means: play on enter, reverse on leave-back,
              play again on re-enter, reverse again on leave-back
    ══════════════════════════════════ */
    const bist = (target, from, to, trigger, start = "top 82%", end = "bottom 15%") =>
      gsap.fromTo(target, from, {
        ...to,
        scrollTrigger: {
          trigger,
          start,
          end,
          toggleActions: TA,
        },
      });

    /* ══ STATS ══ */
    bist(
      statItemsRef.current,
      { y: 50, opacity: 0, scale: 0.85 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.65, ease: "back.out(1.5)", stagger: 0.13 },
      statsRef.current,
    );

    /* ══ CARDS ══ */
    bist(cardsLabelRef.current,
      { y: 25, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.5 },
      cardsSectionRef.current, "top 82%");

    bist(
      cardItemsRef.current,
      { y: 80, opacity: 0, scale: 0.91, rotateY: 8 },
      { y: 0,  opacity: 1, scale: 1, rotateY: 0, duration: 0.8, ease: "power3.out", stagger: 0.18 },
      cardsSectionRef.current, "top 76%",
    );

    /* ══ ABOUT ══ */
    bist(aboutTagRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.4 },
      aboutRef.current, "top 84%");

    bist(aboutTitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.8, ease: "expo.out" },
      aboutRef.current, "top 82%");

    bist(aboutDividerRef.current,
      { scaleX: 0, transformOrigin: "center" },
      { scaleX: 1, duration: 0.6, ease: "power2.out" },
      aboutRef.current, "top 80%");

    bist(aboutBodyRef.current,
      { y: 30, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.6 },
      aboutRef.current, "top 77%");

    bist(
      aboutCardsRef.current,
      { y: 60, opacity: 0, rotateX: 14 },
      { y: 0,  opacity: 1, rotateX: 0, duration: 0.75, ease: "back.out(1.3)", stagger: 0.16 },
      aboutRef.current, "top 72%",
    );

    /* ══ PROCESS ══ */
    bist(processLabelRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.45 },
      processRef.current, "top 84%");

    bist(processHeadRef.current,
      { y: 40, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.7, ease: "expo.out" },
      processRef.current, "top 82%");

    bist(processLineRef.current,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 1.2, ease: "power2.inOut" },
      processRef.current, "top 78%");

    /* alternating left/right slide */
    bist(
      processItemsRef.current,
      { x: (i) => (i % 2 === 0 ? -70 : 70), opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)", stagger: 0.2 },
      processRef.current, "top 75%",
    );

    /* ══ FEATURES ══ */
    bist(featuresPanelRef.current,
      { x: 90, opacity: 0 },
      { x: 0,  opacity: 1, duration: 1.1, ease: "expo.out" },
      featuresRef.current, "top 76%");

    bist(featuresLabelRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.45 },
      featuresRef.current, "top 74%");

    bist(featuresHeadRef.current,
      { y: 40, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.65, ease: "expo.out" },
      featuresRef.current, "top 72%");

    bist(
      featuresListRef.current,
      { x: 55, opacity: 0 },
      { x: 0,  opacity: 1, duration: 0.55, ease: "power2.out", stagger: 0.1 },
      featuresRef.current, "top 69%",
    );

    /* ══ FAQ ══ */
    bist(faqLabelRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.45 },
      faqRef.current, "top 83%");

    bist(faqHeadRef.current,
      { y: 40, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.65, ease: "expo.out" },
      faqRef.current, "top 81%");

    bist(
      faqItemsRef.current,
      { y: 45, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.55, ease: "power2.out", stagger: 0.1 },
      faqRef.current, "top 77%",
    );

    /* ══ CONTACT ══ */
    bist(contactLabelRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.45 },
      contactRef.current, "top 84%");

    bist(contactHeadRef.current,
      { y: 40, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.7, ease: "expo.out" },
      contactRef.current, "top 82%");

    bist(contactBodyRef.current,
      { y: 25, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.5 },
      contactRef.current, "top 80%");

    bist(
      contactInfoRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.65, ease: "back.out(1.4)", stagger: 0.12 },
      contactRef.current, "top 77%",
    );

    bist(contactFormRef.current,
      { x: 60, opacity: 0 },
      { x: 0,  opacity: 1, duration: 0.8, ease: "expo.out" },
      contactRef.current, "top 75%");

  }, { scope: containerRef });

  return (
    <>
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50%       { transform: translateY(-18px) scale(1.08); opacity: 0.7; }
        }
        .animate-float-particle { animation: floatParticle 6s ease-in-out infinite; }

        /* FAQ chevron */
        details[open] .faq-icon { transform: rotate(45deg); color: #10b981; }
        .faq-icon { transition: transform 0.3s ease, color 0.3s ease; display: inline-block; }

        /* 3D heading perspective */
        .hw { display: inline-block; perspective: 600px; }

        /* process gradient line */
        .proc-line {
          background: linear-gradient(to bottom, #10b981 0%, #3b82f6 50%, #10b981 100%);
        }
      `}</style>

      <div ref={containerRef} className="overflow-x-hidden bg-white">

        {/* ── Navbar ── */}
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <div
          id="heroSection"
          className="relative w-full h-screen flex bg-fixed bg-center bg-cover overflow-hidden"
          style={{ backgroundImage: 'url("/Mangroves_at_sunset.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          <Particles />

          {/* Left glass panel */}
          <div
            ref={heroPanelRef}
            className="relative z-10 w-full md:w-[50%] h-full flex items-center
                       px-8 md:px-16 bg-black/20 backdrop-blur-2xl border-r border-white/10"
            style={{ willChange: "transform, opacity" }}
          >
            {/* pt-24 clears the fixed navbar height so pill tag never overlaps */}
            <div className="w-full max-w-lg pt-24 md:pt-10">

              {/* pill tag */}
              {/* <div ref={heroTagRef}
                className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30
                           text-emerald-300 text-xs font-semibold tracking-[0.15em] uppercase rounded-full
                           px-4 py-1.5 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Blue Carbon Protocol
              </div> */}

              {/* accent line */}
              <div ref={heroLineRef}
                className="h-[2px] w-14 bg-gradient-to-r from-emerald-400 to-blue-400 mb-7 rounded-full" />

              {/* split heading */}
              <h1
                ref={heroHeadingRef}
                className="text-white mb-5 font-black leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
              >
                {[
                  ["Track", "And", "Trade"],
                  ["Blue", "Carbon"],
                  ["With", "Blockchain", "Transparency"],
                ].map((line, li) => (
                  <span key={li} className="block">
                    {line.map((w, wi) => (
                      <span key={wi} className="hw mr-[0.22em]">
                        {w === "Trade" || w === "Transparency"
                          ? <span className="text-emerald-400">{w}</span>
                          : w === "Blockchain"
                          ? <span className="text-blue-300">{w}</span>
                          : w}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              <p ref={heroSubRef}
                className="text-white/60 text-[0.95rem] leading-relaxed mb-8 max-w-sm">
                Empowering communities to restore ecosystems and trade verified carbon credits with full on-chain transparency.
              </p>

              <div ref={heroBtnRef} className="flex items-center gap-4 flex-wrap">
                <Link href="/sign-in">
                  <button className="relative px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400
                                     text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/30
                                     transition-all duration-300 hover:scale-105 hover:shadow-emerald-400/50 overflow-hidden group">
                    <span className="relative z-10">Get Started →</span>
                    <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                  </button>
                </Link>
                <Link href="#about">
                  <button className="px-6 py-3.5 rounded-full border border-white/20 text-white/70
                                     hover:text-white hover:border-white/40 text-sm font-medium
                                     transition-all duration-300 backdrop-blur-sm">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating info badge */}
          <div className="hidden md:flex w-[50%] items-center justify-center relative z-10">
            <div
              ref={heroBadgeRef}
              className="bg-black/30 backdrop-blur-2xl border border-white/15 rounded-3xl p-8
                         w-[260px] text-center shadow-2xl"
              style={{ willChange: "transform" }}
            >
              <div className="text-6xl mb-4">🌊</div>
              <p className="text-white font-black text-2xl mb-1">12,000+</p>
              <p className="text-emerald-300 text-sm mb-5">Hectares Protected</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {["Mangrove", "Wetland", "Forest"].map((t) => (
                  <span key={t}
                    className="text-[10px] bg-emerald-500/20 border border-emerald-400/30
                               text-emerald-300 rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
              {/* mini progress bars */}
              <div className="mt-5 space-y-2 text-left">
                {[["CO₂ Offset", 82], ["Area Coverage", 67], ["Verified", 98]].map(([l, v]) => (
                  <div key={l}>
                    <div className="flex justify-between text-[10px] text-white/50 mb-1">
                      <span>{l}</span><span>{v}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                        style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div ref={heroScrollRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
          </div>
        </div>

        {/* ════════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════════ */}
        <div
          ref={statsRef}
          className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 py-14 px-6 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, #10b981 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #3b82f6 0%, transparent 55%)" }} />
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)" }} />

          <div className="relative flex flex-wrap justify-center gap-8 md:gap-20 mt-1">
            {stats.map((s, i) => (
              <div
                key={s.label}
                ref={(el) => (statItemsRef.current[i] = el)}
                className="text-center group cursor-default"
              >
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{s.icon}</div>
                <p className="text-5xl font-black text-transparent bg-clip-text
                              bg-gradient-to-b from-emerald-300 to-emerald-600 leading-none">{s.value}</p>
                <p className="text-white/40 text-xs mt-2 tracking-widest uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════
            CARDS SECTION
        ════════════════════════════════════════ */}
        <div
          ref={cardsSectionRef}
          id="cards"
          className="relative px-6 py-28 min-h-[80vh] bg-white overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-50 blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-50 blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto">
            <div ref={cardsLabelRef} className="text-center mb-16">
              <p className="text-emerald-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Three Steps to Real Impact
              </h2>
            </div>

            <div className="flex justify-evenly items-start flex-wrap gap-8">
              {cards.map(({ Key, title, number, subtext, body, icon }, i) => (
                <div
                  key={Key}
                  ref={(el) => (cardItemsRef.current[i] = el)}
                  className="group relative"
                >
                  <div className="absolute -inset-2 rounded-3xl bg-emerald-400/0 group-hover:bg-emerald-400/8
                                  transition-all duration-500 blur-md pointer-events-none" />
                  <Cards title={title} number={number} subtext={subtext} body={body} icon={icon} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            ABOUT SECTION
        ════════════════════════════════════════ */}
        <section
          id="about"
          ref={aboutRef}
          className="relative px-6 md:px-20 py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/50"
        >
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
                          bg-gradient-to-br from-emerald-100/60 to-blue-100/60 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full
                          bg-gradient-to-tr from-green-100/40 to-transparent blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto text-center">
            <p ref={aboutTagRef}
              className="inline-block text-emerald-600 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Our Mission
            </p>
            <h2 ref={aboutTitleRef}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">
                Layer Zero
              </span>
            </h2>

            <div ref={aboutDividerRef}
              className="mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 mb-8" />

            <p ref={aboutBodyRef}
              className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              <strong className="text-gray-900">Layer Zero</strong> bridges grassroots restoration efforts with modern
              technology — empowering communities to log ecological work using geospatial forms, verified by trusted
              admins and logged on-chain for integrity, impact, and traceability.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { emoji: "🌿", title: "Environmental Restoration", body: "From mangroves to wetlands — record and monitor your ecosystem restoration efforts with precision.", grad: "from-emerald-500/10 to-green-400/5",   border: "border-emerald-200/70", accent: "text-emerald-700", dot: "bg-emerald-400" },
                { emoji: "🔗", title: "Blockchain Integrity",       body: "Immutably log verified environmental data to Solana for open auditing and full traceability.",         grad: "from-blue-500/10 to-indigo-400/5",   border: "border-blue-200/70",    accent: "text-blue-700",    dot: "bg-blue-400"    },
                { emoji: "👥", title: "Community First",            body: "Empower local organizations and individuals through accessible tools and transparent systems.",          grad: "from-amber-500/10 to-orange-400/5",  border: "border-amber-200/70",   accent: "text-amber-700",   dot: "bg-amber-400"   },
              ].map((c, i) => (
                <div
                  key={c.title}
                  ref={(el) => (aboutCardsRef.current[i] = el)}
                  className={`relative p-8 bg-gradient-to-br ${c.grad} border ${c.border}
                              rounded-3xl hover:shadow-2xl hover:-translate-y-3
                              transition-all duration-500 text-left overflow-hidden group cursor-default`}
                >
                  <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full ${c.dot} opacity-10
                                  group-hover:opacity-25 group-hover:scale-110 transition-all duration-500`} />
                  <span className="text-4xl block mb-5">{c.emoji}</span>
                  <h3 className={`text-lg font-bold mb-3 ${c.accent}`}>{c.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            PROCESS TIMELINE (dark section)
        ════════════════════════════════════════ */}
        <section
          ref={processRef}
          className="relative px-6 md:px-20 py-28 bg-gradient-to-br from-gray-950 to-emerald-950 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 65%)" }} />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 80px)" }} />

          <div className="relative max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p ref={processLabelRef}
                className="text-emerald-400 text-sm font-semibold tracking-[0.22em] uppercase mb-3">
                The Journey
              </p>
              <h2 ref={processHeadRef}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Field to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                  Blockchain
                </span>
              </h2>
            </div>

            <div className="relative">
              {/* vertical gradient line */}
              <div ref={processLineRef}
                className="proc-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] rounded-full" />

              <div className="space-y-12">
                {processSteps.map((s, i) => (
                  <div
                    key={s.n}
                    ref={(el) => (processItemsRef.current[i] = el)}
                    className={`relative flex items-center gap-6 ${s.side === "right" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 backdrop-blur-sm
                                    rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-400/30
                                    transition-all duration-400 group cursor-default`}>
                      <span className="text-3xl block mb-3">{s.emoji}</span>
                      <p className="text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-1.5">{s.n}</p>
                      <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                    </div>

                    {/* center dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full
                                    bg-emerald-400 border-4 border-gray-950 z-10 shadow-lg shadow-emerald-400/40
                                    ring-2 ring-emerald-400/20" />

                    <div className="w-[calc(50%-2.5rem)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURES SECTION
        ════════════════════════════════════════ */}
        <section
          id="features"
          ref={featuresRef}
          className="relative w-full min-h-[90vh] flex bg-fixed bg-center bg-cover"
          style={{ backgroundImage: 'url("/Mangroves_at_sunset.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/55 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

          <div className="hidden md:block w-[50%]" />

          <div
            ref={featuresPanelRef}
            className="relative z-10 w-full md:w-[50%] min-h-[90vh] flex items-center
                       px-8 md:px-14 bg-black/35 backdrop-blur-2xl border-l border-white/10"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="text-white w-full space-y-7 py-16">
              <p ref={featuresLabelRef}
                className="text-emerald-400 text-xs font-semibold tracking-[0.25em] uppercase">
                Platform
              </p>
              <h2 ref={featuresHeadRef}
                className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Everything You<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                  Need to Restore
                </span>
              </h2>

              <ul className="space-y-3 pt-2">
                {featureItems.map((item, i) => (
                  <li
                    key={i}
                    ref={(el) => (featuresListRef.current[i] = el)}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <span className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/8 border border-white/10
                                     flex items-center justify-center text-emerald-400
                                     group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40
                                     transition-all duration-300">
                      {item.icon}
                    </span>
                    <span className="text-white/70 group-hover:text-white text-sm leading-snug
                                     transition-colors duration-200 flex-1">
                      {item.text}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/0 group-hover:bg-emerald-400
                                     transition-all duration-300 flex-shrink-0" />
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link href="/sign-in">
                  <button className="px-7 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400
                                     text-white font-semibold text-sm tracking-wide
                                     transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25">
                    Start a Project →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FAQ SECTION
        ════════════════════════════════════════ */}
        <section
          id="faq"
          ref={faqRef}
          className="relative px-6 md:px-20 py-28 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/40"
        >
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full
                          bg-gradient-to-tr from-emerald-100/50 to-blue-100/50 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full
                          bg-gradient-to-bl from-blue-100/40 to-transparent blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">
            <p ref={faqLabelRef}
              className="text-emerald-600 text-sm font-semibold tracking-[0.2em] uppercase text-center mb-3">
              Got Questions?
            </p>
            <h2 ref={faqHeadRef}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-14 tracking-tight">
              Frequently Asked
            </h2>

            <div className="space-y-3">
              {faqs.map((item, i) => (
                <details
                  key={i}
                  ref={(el) => (faqItemsRef.current[i] = el)}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm
                             hover:shadow-md hover:border-emerald-100 transition-all duration-300 overflow-hidden"
                >
                  <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer select-none">
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <span className="flex-1 font-semibold text-gray-800 text-base">{item.q}</span>
                    <span className="faq-icon w-7 h-7 rounded-full border border-gray-200 inline-flex items-center
                                     justify-center text-gray-400 text-lg font-light flex-shrink-0
                                     group-open:border-emerald-300 group-hover:border-gray-300">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4 ml-10">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CONTACT SECTION
        ════════════════════════════════════════ */}
        <section
          id="contact"
          ref={contactRef}
          className="relative px-6 md:px-20 py-28 overflow-hidden bg-gradient-to-br from-gray-950 to-emerald-950"
        >
          {/* mesh glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 30% 60%, rgba(16,185,129,0.14) 0%, transparent 60%), radial-gradient(ellipse at 75% 30%, rgba(59,130,246,0.10) 0%, transparent 55%)" }} />
          {/* grid texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 72px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 72px)" }} />

          <div className="relative max-w-6xl mx-auto">

            {/* header */}
            <div className="text-center mb-16">
              <p ref={contactLabelRef}
                className="text-emerald-400 text-sm font-semibold tracking-[0.22em] uppercase mb-3">
                Get In Touch
              </p>
              <h2 ref={contactHeadRef}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                Let's{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                  Connect
                </span>
              </h2>
              <p ref={contactBodyRef} className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
                Whether you're an NGO, community restorer, carbon buyer, or just curious — we'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

              {/* ── Left: info cards ── */}
              <div className="space-y-5">
                {[
                  { emoji: "📧", title: "Email Us", body: "support@layerzero.eco", sub: "We reply within 24 hours", href: "mailto:support@layerzero.eco" },
                  { emoji: "🌍", title: "Headquartered In", body: "India — Global Impact", sub: "Operating across South & Southeast Asia", href: null },
                  { emoji: "🤝", title: "Partnership Inquiries", body: "partners@layerzero.eco", sub: "NGOs, corporates, and government bodies", href: "mailto:partners@layerzero.eco" },
                  { emoji: "🛠️", title: "Technical Support", body: "dev@layerzero.eco", sub: "API, blockchain, and platform queries", href: "mailto:dev@layerzero.eco" },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    ref={(el) => (contactInfoRef.current[i] = el)}
                    className="flex items-start gap-5 p-5 bg-white/5 border border-white/10 rounded-2xl
                               hover:bg-white/8 hover:border-emerald-400/25 transition-all duration-300 group"
                  >
                    <span className="w-11 h-11 flex-shrink-0 rounded-xl bg-white/5 border border-white/10
                                     flex items-center justify-center text-2xl
                                     group-hover:bg-emerald-500/20 group-hover:border-emerald-400/30
                                     transition-all duration-300">
                      {item.emoji}
                    </span>
                    <div>
                      <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-0.5">{item.title}</p>
                      {item.href
                        ? <a href={item.href} className="text-white font-semibold text-sm hover:text-emerald-400 transition-colors duration-200">{item.body}</a>
                        : <p className="text-white font-semibold text-sm">{item.body}</p>
                      }
                      <p className="text-white/35 text-xs mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Right: email form ── */}
              <div
                ref={contactFormRef}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
              >
                {status === "sent" ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <span className="text-6xl">🎉</span>
                    <h3 className="text-white text-2xl font-bold">Message Sent!</h3>
                    <p className="text-white/50 text-sm max-w-xs">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400
                                 text-white text-sm font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-white font-bold text-xl mb-6">Send us a message</h3>

                    <div className="space-y-4">
                      {/* Name + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/40 text-xs font-semibold tracking-widest uppercase mb-2">Name</label>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                                       text-white text-sm placeholder-white/25 outline-none
                                       focus:border-emerald-400/50 focus:bg-white/8 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-white/40 text-xs font-semibold tracking-widest uppercase mb-2">Email</label>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                                       text-white text-sm placeholder-white/25 outline-none
                                       focus:border-emerald-400/50 focus:bg-white/8 transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-white/40 text-xs font-semibold tracking-widest uppercase mb-2">Subject</label>
                        <input
                          type="text"
                          placeholder="How can we help?"
                          value={form.subject}
                          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                                     text-white text-sm placeholder-white/25 outline-none
                                     focus:border-emerald-400/50 focus:bg-white/8 transition-all duration-200"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-white/40 text-xs font-semibold tracking-widest uppercase mb-2">Message</label>
                        <textarea
                          rows={5}
                          placeholder="Tell us about your project, question, or partnership idea…"
                          value={form.message}
                          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                                     text-white text-sm placeholder-white/25 outline-none resize-none
                                     focus:border-emerald-400/50 focus:bg-white/8 transition-all duration-200"
                        />
                      </div>

                      {/* Error */}
                      {status === "error" && (
                        <p className="text-red-400 text-xs">Something went wrong. Please try emailing us directly at support@layerzero.eco</p>
                      )}

                      {/* Submit */}
                      <button
                        disabled={status === "sending"}
                        onClick={async () => {
                          if (!form.name || !form.email || !form.message) return;
                          setStatus("sending");
                          try {
                            // Uses mailto as a reliable fallback — swap for API call (Resend / Nodemailer) when backend is ready
                            const mailto = `mailto:support@layerzero.eco?subject=${encodeURIComponent(`[LayerZero] ${form.subject || "Contact Form"}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
                            window.location.href = mailto;
                            // Optimistically show success after short delay
                            setTimeout(() => setStatus("sent"), 800);
                          } catch {
                            setStatus("error");
                          }
                        }}
                        className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400
                                   text-white font-semibold text-sm tracking-wide
                                   transition-all duration-300 hover:scale-[1.02] disabled:opacity-60
                                   disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20
                                   hover:shadow-emerald-400/30 flex items-center justify-center gap-2"
                      >
                        {status === "sending" ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          "Send Message →"
                        )}
                      </button>

                      <p className="text-white/25 text-xs text-center pt-1">
                        Or email us directly at{" "}
                        <a href="mailto:support@layerzero.eco" className="text-emerald-400/70 hover:text-emerald-400 transition-colors duration-200">
                          support@layerzero.eco
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;