"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { StickyNote, Check, Trash2, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MonthTheme } from "@/lib/themes";

interface NotesProps {
  currentDate: Date;
  theme: MonthTheme;
}

export function Notes({ currentDate, theme }: NotesProps) {
  const [notes, setNotes]       = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [mounted, setMounted]   = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const monthKey = format(currentDate, "yyyy-MM");

  // Load from localStorage when month changes
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`cal-notes-${monthKey}`) ?? "";
    setNotes(stored);
    setSavedNotes(stored);
  }, [monthKey]);

  const isDirty = notes !== savedNotes;

  const handleSave = () => {
    localStorage.setItem(`cal-notes-${monthKey}`, notes);
    setSavedNotes(notes);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const handleClear = () => {
    setNotes("");
    setSavedNotes("");
    localStorage.removeItem(`cal-notes-${monthKey}`);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full min-h-[240px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4" style={{ color: theme.accent }} />
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: theme.textPrimary, fontFamily: "'Playfair Display', serif" }}
          >
            {format(currentDate, "MMMM")} Notes
          </span>
        </div>
        <div className="flex items-center gap-1">
          <AnimatePresence>
            {isDirty && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className="p-1.5 rounded-full transition-colors"
                style={{ color: theme.accent }}
                title="Save"
              >
                <PenLine className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {savedFlash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-1.5 rounded-full"
                style={{ color: "#4ade80" }}
              >
                <Check className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClear}
            className="p-1.5 rounded-full transition-colors"
            style={{ color: theme.textMuted }}
            title="Clear notes"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Textarea — no custom ruled lines, clean and reliable */}
      <div className="relative flex-1">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onKeyDown={e => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
              e.preventDefault();
              handleSave();
            }
          }}
          placeholder="Jot down your thoughts…"
          className="notes-textarea relative w-full h-full min-h-[180px] resize-none bg-transparent border-none outline-none text-sm font-light"
          style={{
            color: theme.textPrimary,
            caretColor: theme.accent,
            lineHeight: "2rem",
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent calc(2rem - 1px),
              ${theme.cardBorder} calc(2rem - 1px),
              ${theme.cardBorder} 2rem
            )`,
            backgroundAttachment: "local",
          }}
          spellCheck={false}
        />
      </div>

      {/* Footer hint */}
      <p className="mt-2 text-xs" style={{ color: theme.textMuted }}>
        {isDirty ? "Unsaved changes · Ctrl+S to save" : notes ? "Saved" : ""}
      </p>
    </div>
  );
}
