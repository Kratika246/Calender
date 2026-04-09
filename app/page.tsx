"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/Calendar";
import { Notes } from "@/components/Notes";
import { MONTH_THEMES } from "@/lib/themes";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate,  setStartDate]  = useState<Date | null>(null);
  const [endDate,    setEndDate]    = useState<Date | null>(null);

  const theme = MONTH_THEMES[currentDate.getMonth()];

  return (
    <motion.main
      className="h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ padding: "18px" }}
      animate={{ background: theme.bgGradient }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      {/* ── Wall Calendar card ── */}
      <div
        className="w-full relative"
        style={{
          maxWidth: "900px",
          filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))",
        }}
      >
        {/* Binding rings */}
        <div className="absolute -top-3.5 left-0 right-0 flex justify-center gap-16 z-20 pointer-events-none">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="w-4 h-5 rounded-full border-2"
              style={{
                borderColor: theme.accent,
                background: "rgba(255,255,255,0.6)",
                boxShadow: `0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.8)`,
              }}
            />
          ))}
        </div>

        {/* ── Outer card ── */}
        <motion.div
          key={currentDate.getMonth()}
          className="rounded-xl overflow-hidden"
          style={{
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9)`,
          }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── HERO IMAGE ── */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "38vh", minHeight: "160px", maxHeight: "260px" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme.image}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <Image
                  src={theme.image}
                  alt={theme.label}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom gradient — image fades into card */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
              style={{
                height: "55%",
                background: `linear-gradient(to bottom, transparent 0%, ${theme.imageBlur}bb 60%, ${theme.imageBlur}ff 100%)`,
              }}
            />

            {/* Month title over image */}
            <div className="absolute bottom-3 left-5 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  <p
                    className="text-2xl sm:text-3xl font-bold leading-tight"
                    style={{
                      color: theme.textPrimary,
                      fontFamily: "'Playfair Display', serif",
                      textShadow: "0 1px 12px rgba(255,255,255,0.6)",
                    }}
                  >
                    {theme.label}
                  </p>
                  <p
                    className="text-xs tracking-[0.22em] uppercase font-semibold mt-0.5"
                    style={{ color: theme.accent }}
                  >
                    {theme.name}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── BOTTOM PANELS ── */}
          <div
            className="flex flex-col md:flex-row"
            style={{ background: theme.cardBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            {/* Calendar — right on desktop, top on mobile */}
            <div
              className="w-full md:w-3/5 px-4 py-3 order-1 md:order-2"
              style={{ borderLeft: `1px solid ${theme.cardBorder}` }}
            >
              <Calendar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                theme={theme}
              />
            </div>

            {/* Notes — left on desktop, bottom on mobile */}
            <div className="w-full md:w-2/5 px-4 py-3 order-2 md:order-1">
              <Notes currentDate={currentDate} theme={theme} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
