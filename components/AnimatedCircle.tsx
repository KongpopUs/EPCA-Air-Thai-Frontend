"use client";

import { motion } from "framer-motion";

export default function AnimatedCircle({ value }: { value: number }) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-64 h-64 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-xl"
      style={{
        backgroundColor:
          value <= 25 ? "#22c55e"
          : value <= 50 ? "#eab308"
          : value <= 100 ? "#fb923c"
          : "#ef4444"
      }}
    >
      <div className="text-5xl">{value.toFixed(2)}</div>
      <div className="text-lg">µg/m³</div>
    </motion.div>
  );
}
