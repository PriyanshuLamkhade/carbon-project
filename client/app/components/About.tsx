"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.3, duration: 0.7, ease: [0.42, 0, 0.58, 1] },
  }),
};

export default function AboutPage() {
  return (
    <section className="bg-white min-h-screen py-20 px-6 flex items-center justify-center">
      <div className="max-w-5xl bg-gray-50 rounded-3xl shadow-2xl p-14 space-y-16 text-gray-900">
        <motion.h2
          className="text-5xl font-extrabold text-center relative pb-5 mb-12 max-w-max mx-auto
          before:block before:absolute before:-bottom-3 before:left-1/2 before:-translate-x-1/2
          before:w-28 before:h-1.5 before:rounded-full before:bg-gradient-to-r before:from-green-400 before:to-blue-500"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          About Our Platform
        </motion.h2>

        <motion.article className="space-y-12 max-w-4xl mx-auto">
          {/* Block 1 */}
          <motion.div
            className="flex gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeUp}
            custom={1}
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-400 text-white flex items-center justify-center text-4xl font-extrabold select-none shadow-lg">
              🌍
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-green-700">
                The Problem: Trust in Carbon Tracking
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                In a world racing against climate change, one challenge remains —{" "}
                <strong>trust.</strong> Carbon credits and sustainability projects promise a greener future, but without transparency, how can we be sure real impact is happening? Too often, carbon tracking feels like a black box, leaving communities, organizations, and buyers wondering if their efforts truly make a difference.
              </p>
            </div>
          </motion.div>

          {/* Block 2 */}
          <motion.div
            className="flex gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeUp}
            custom={2}
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-extrabold select-none shadow-lg">
              🔗
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-600">
                Our Mission: Verifiable, Accessible, Fair
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                That’s where we come in. Our blockchain-powered platform transforms carbon credits into <em>verifiable, accessible, and fair</em> assets. By combining cutting-edge technology with real-world data, we create a transparent record you can trust — from field measurements to tokenized credits. Every step is traceable, every claim backed by proof.
              </p>
            </div>
          </motion.div>

          {/* Block 3 */}
          <motion.div
            className="flex gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeUp}
            custom={3}
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-teal-400 text-white flex items-center justify-center text-4xl font-extrabold select-none shadow-lg">
              🌱
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-teal-600">
                Our Vision: Empower a Greener Future
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our vision is bold: to empower anyone — communities restoring forests, NGOs championing conservation, or individuals making greener choices — to contribute confidently to a sustainable future. Together, we’re building a world where carbon credits aren’t just promises, but powerful tools for real climate action.
              </p>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}
