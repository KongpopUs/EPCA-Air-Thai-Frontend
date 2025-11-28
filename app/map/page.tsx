"use client";

import { useEffect, useState } from "react";
import BangKhenMap from "../../components/BangKhenMap";
import { motion } from "framer-motion";

const API_BASE = "http://127.0.0.1:8000";

export default function MapPage() {
  const [pmValue, setPmValue] = useState<number | null>(null);

  // โหลดค่าจริงจาก backend
  useEffect(() => {
    fetch(`${API_BASE}/current`)
      .then((res) => res.json())
      .then((data) => setPmValue(data.pm25))
      .catch(console.error);
  }, []);

  if (pmValue === null) {
    return <p className="text-center mt-10">กำลังโหลดแผนที่...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-sky-800">
            แผนที่คุณภาพอากาศ
          </h1>
          <p className="text-slate-600 text-lg">
            แสดงตำแหน่งพื้นที่ตรวจวัด PM2.5 พร้อมสถานะคุณภาพอากาศ
          </p>
        </motion.div>

        {/* MAP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100"
        >
          <BangKhenMap pm25={pmValue} />
        </motion.div>

        {/* STATUS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white rounded-2xl shadow-md border border-slate-100"
        >
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            สถานะคุณภาพอากาศ
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded bg-green-500"></div>
              <span className="text-slate-700 text-sm">ดี (0 - 25)</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded bg-yellow-400"></div>
              <span className="text-slate-700 text-sm">ปานกลาง (26 - 50)</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded bg-orange-500"></div>
              <span className="text-slate-700 text-sm">
                เริ่มมีผลกระทบ (51 - 100)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded bg-red-500"></div>
              <span className="text-slate-700 text-sm">อันตราย (&gt; 100)</span>
            </div>
          </div>
        </motion.div>

        {/* FOOTNOTE */}
        <p className="text-sm text-slate-500 text-center py-4">
          ข้อมูลนี้เป็นเพียงตัวอย่างการแสดงแผนที่ในระบบ EPCA Air Thai เท่านั้น
        </p>
      </main>
    </div>
  );
}