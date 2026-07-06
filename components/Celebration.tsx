"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Sun, Waves, Star, Heart } from "lucide-react";
import { useApp } from "@/lib/store";

const BURST = [
  { Icon: Sparkles, color: "#eaa41f" },
  { Icon: Sun, color: "#f2683f" },
  { Icon: Waves, color: "#0fa3c4" },
  { Icon: Star, color: "#eaa41f" },
  { Icon: Heart, color: "#ec5f86" },
  { Icon: Sparkles, color: "#2f9be0" },
];

export default function Celebration() {
  const { celebrate } = useApp();
  return (
    <AnimatePresence>
      {celebrate && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[2000] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {BURST.map(({ Icon, color }, i) => (
            <motion.span
              key={i}
              className="absolute"
              style={{ color }}
              initial={{ y: 40, opacity: 0, scale: 0.4 }}
              animate={{
                y: -220 - i * 18,
                x: (i - 2.5) * 74,
                opacity: [0, 1, 1, 0],
                scale: 1.1,
                rotate: (i - 2.5) * 40,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <Icon
                size={34}
                strokeWidth={2.2}
                fill="currentColor"
                fillOpacity={0.18}
              />
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
