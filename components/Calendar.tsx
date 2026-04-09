"use client";

import React, { useState, useCallback } from "react";
import {
  addMonths, subMonths, format,
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  isSameMonth, isSameDay, addDays,
  isBefore, isWithinInterval, isToday,
  differenceInCalendarDays,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MonthTheme } from "@/lib/themes";
import { getHoliday } from "@/lib/holidays";
import { ClickSpark } from "@/components/ClickSpark";

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  theme: MonthTheme;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    rotateY: dir > 0 ? 12 : -12,
  }),
  center: { x: 0, opacity: 1, rotateY: 0 },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    rotateY: dir > 0 ? -12 : 12,
  }),
};

export function Calendar({
  currentDate, setCurrentDate,
  startDate, setStartDate,
  endDate, setEndDate,
  theme,
}: CalendarProps) {
  const [direction, setDirection] = useState(1);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipHoliday, setTooltipHoliday] = useState<{ key: string; label: string } | null>(null);

  const navigateMonth = useCallback((delta: number) => {
    setDirection(delta);
    setCurrentDate(prev => delta > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  }, [setCurrentDate]);

  const handleDateClick = useCallback((day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (isBefore(day, startDate)) {
        setStartDate(day);
        setEndDate(null);
      } else if (isSameDay(day, startDate)) {
        setStartDate(null);
        setEndDate(null);
      } else {
        setEndDate(day);
      }
    }
  }, [startDate, endDate, setStartDate, setEndDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd  = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart);
  const gridEnd   = endOfWeek(monthEnd);

  const days: Date[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const getDayMeta = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, monthStart);
    const isStart = !!(startDate && isSameDay(day, startDate));
    const isEnd   = !!(endDate   && isSameDay(day, endDate));

    const inConfirmedRange = !!(
      startDate && endDate &&
      isWithinInterval(day, { start: startDate, end: endDate })
    );
    const inHoverRange = !!(
      startDate && !endDate && hoveredDate &&
      !isBefore(hoveredDate, startDate) &&
      isWithinInterval(day, { start: startDate, end: hoveredDate })
    );
    const isInRange = inConfirmedRange || inHoverRange;

    const rangeDelay =
      startDate && isInRange
        ? Math.max(0, differenceInCalendarDays(day, startDate)) * 0.04
        : 0;

    return { isCurrentMonth, isStart, isEnd, isInRange, isToday: isToday(day), rangeDelay };
  };

  const rangeLength =
    startDate && endDate
      ? differenceInCalendarDays(endDate, startDate) + 1
      : null;

  return (
    <div className="w-full flex flex-col gap-0">
      {/* ── Month navigation header ── */}
      <div className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
      >
        <motion.button
          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.88 }}
          onClick={() => navigateMonth(-1)}
          className="p-1.5 rounded-full"
          style={{ color: theme.textSecondary }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={format(currentDate, "MMMM-yyyy")}
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="text-center"
            style={{ perspective: 600, transformStyle: "preserve-3d" }}
          >
            <p
              className="text-base font-bold tracking-widest uppercase"
              style={{ color: theme.accent, fontFamily: "'Playfair Display', serif" }}
            >
              {format(currentDate, "MMMM")}
            </p>
            <p className="text-xs tracking-wider" style={{ color: theme.textMuted }}>
              {format(currentDate, "yyyy")}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.88 }}
          onClick={() => navigateMonth(1)}
          className="p-1.5 rounded-full"
          style={{ color: theme.textSecondary }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* ── Weekday labels ── */}
      <div className="grid grid-cols-7 pt-1.5 pb-0.5">
        {WEEKDAYS.map(d => (
          <div
            key={d}
            className="text-center text-xs font-semibold tracking-widest uppercase py-0.5"
            style={{ color: theme.textMuted }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <div className="overflow-hidden" style={{ perspective: "900px" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={format(currentDate, "MMMM-yyyy")}
            custom={direction}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.38, ease: "easeInOut" }}
            className="grid grid-cols-7"
            style={{ transformStyle: "preserve-3d" }}
          >
            {days.map((day, idx) => {
              const { isCurrentMonth, isStart, isEnd, isInRange, isToday: today, rangeDelay } = getDayMeta(day);
              const isSelected = isStart || isEnd;
              const holiday = isCurrentMonth ? getHoliday(day) : null;
              const tooltipKey = `${format(day, "yyyy-MM-dd")}`;

              return (
                <ClickSpark key={idx} sparkColors={isCurrentMonth ? theme.sparkColors : ["#ffffff22"]}>
                  <div
                    className="relative flex flex-col items-center justify-center h-9 cursor-pointer select-none"
                    onMouseEnter={() => {
                      if (isCurrentMonth) setHoveredDate(day);
                      if (holiday) setTooltipHoliday({ key: tooltipKey, label: holiday });
                    }}
                    onMouseLeave={() => {
                      setHoveredDate(null);
                      setTooltipHoliday(null);
                    }}
                    onClick={() => isCurrentMonth && handleDateClick(day)}
                  >
                    {/* ── Range fill (flows from start) ── */}
                    {isInRange && !isSelected && (
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: theme.rangeColor, originX: 0 }}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.22, delay: rangeDelay, ease: "easeOut" }}
                      />
                    )}
                    {/* Half-fill caps */}
                    {isStart && (endDate || hoveredDate) && (
                      <div
                        className="absolute top-0 bottom-0 right-0 w-1/2"
                        style={{ background: theme.rangeColor }}
                      />
                    )}
                    {isEnd && startDate && (
                      <div
                        className="absolute top-0 bottom-0 left-0 w-1/2"
                        style={{ background: theme.rangeColor }}
                      />
                    )}

                    {/* ── Date circle ── */}
                    <motion.div
                      className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-sm transition-colors"
                      whileHover={isCurrentMonth ? { scale: 1.18, y: -1 } : {}}
                      whileTap={isCurrentMonth ? { scale: 0.86 } : {}}
                      style={{
                        background: isSelected ? theme.selectedBg : "transparent",
                        color: isSelected
                          ? theme.selectedText
                          : isCurrentMonth ? theme.textPrimary : theme.textMuted,
                        boxShadow: isSelected
                          ? `0 2px 12px ${theme.accent}44`
                          : today
                          ? `0 0 0 1.5px ${theme.todayRing}`
                          : "none",
                        fontWeight: isSelected || today ? 700 : 400,
                        opacity: isCurrentMonth ? 1 : 0.25,
                        fontSize: "0.85rem",
                      }}
                      transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    >
                      {format(day, "d")}
                    </motion.div>

                    {/* ── Holiday dot + tooltip ── */}
                    {holiday && isCurrentMonth && (
                      <div className="relative z-10">
                        <div
                          className="w-1 h-1 rounded-full mt-0.5"
                          style={{ background: theme.holidayColor }}
                        />
                        {tooltipHoliday?.key === tooltipKey && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap z-50 pointer-events-none"
                            style={{
                              background: theme.cardBg,
                              border: `1px solid ${theme.cardBorder}`,
                              color: theme.textPrimary,
                              backdropFilter: "blur(12px)",
                              boxShadow: `0 4px 16px rgba(0,0,0,0.12)`,
                            }}
                          >
                            {holiday}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </ClickSpark>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Selection info bar ── */}
      <AnimatePresence>
        {startDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
            style={{ borderTop: `1px solid ${theme.cardBorder}` }}
          >
            <div className="flex items-center justify-between px-4 py-2 text-xs">
              <span style={{ color: theme.textMuted }}>
                <span style={{ color: theme.accent, fontWeight: 600 }}>
                  {format(startDate, "MMM d")}
                </span>
                {endDate && (
                  <>
                    <span className="mx-1.5" style={{ color: theme.textMuted }}>→</span>
                    <span style={{ color: theme.accent, fontWeight: 600 }}>
                      {format(endDate, "MMM d")}
                    </span>
                  </>
                )}
                {rangeLength && (
                  <span className="ml-2" style={{ color: theme.textMuted }}>
                    · {rangeLength} {rangeLength === 1 ? "day" : "days"}
                  </span>
                )}
              </span>
              <button
                className="text-xs transition-colors font-medium"
                style={{ color: theme.accent }}
                onClick={() => { setStartDate(null); setEndDate(null); }}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
