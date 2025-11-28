"use client";

import { useEffect, useState } from "react";
import Forecast from "../../components/Forecast";
import Calendar from "../../components/Calenda";
import { Calendar as CalendarIcon, LucideSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PM25LevelBar from "../forecast/PM25LevelBar";

const API_BASE = "http://127.0.0.1:8000";

export default function ForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [customForecast, setCustomForecast] = useState([]);

  // โหลด forecast ปกติ
  const loadForecast = () => {
    fetch(`${API_BASE}/forecast`)
      .then((r) => r.json())
      .then(setForecastData);
  };

  useEffect(loadForecast, []);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };

  // ค้นหา 5 วันถัดไป
  const handleSearch = async () => {
    if (!selectedDate) return alert("กรุณาเลือกวันที่ก่อน");

    const results = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      const dateStr = formatDate(d);

      const r = await fetch(`${API_BASE}/predict_pm25_by_date`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr }),
      });

      const data = await r.json();

      results.push({
        date: dateStr,
        pm25: data.predicted_pm25,
        humidity: data.humidity,
        temperature: data.temperature,
        pressure: data.pressure,
      });
    }

    setCustomForecast(results);
  };

  const display = customForecast.length > 0 ? customForecast : forecastData;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-slate-800 tracking-wide"
        >
          ข้อมูลพยากรณ์อากาศ PM2.5
        </motion.h1>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-md px-6 py-5 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="w-full md:w-1/4 text-sm font-semibold text-slate-700">
            เลือกวันที่ต้องการ
          </div>

          {/* INPUT */}
          <div className="flex-1 w-full flex items-center gap-3 relative">
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="
                flex-1 p-3 rounded-xl bg-white 
                border border-slate-300 shadow-sm
                focus:ring-2 focus:ring-sky-600 focus:outline-none
                text-slate-800 placeholder-slate-400
              "
            />

            {/* CALENDAR BUTTON */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="
                w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200
                flex items-center justify-center text-slate-700 shadow-sm
                transition
              "
            >
              <CalendarIcon size={20} />
            </button>

            {/* SEARCH BUTTON */}
            <button
              onClick={handleSearch}
              className="
                px-5 h-11 rounded-xl bg-sky-600 hover:bg-sky-700
                text-white font-semibold shadow transition flex items-center gap-2
              "
            >
              <LucideSearch size={18} />
              ค้นหา
            </button>

            {/* POPUP CALENDAR */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, x: 10, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 10, y: 10 }}
                  className="absolute right-0 top-14 z-40"
                >
                  <Calendar
                    onSelectDate={(d) => {
                      setSelectedDate(formatDate(d));
                      setShowCalendar(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* LEVEL BAR */}
        <PM25LevelBar pm25={display[0]?.pm25 || 0} />

        {/* LIST FORECAST */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Forecast data={display} />
        </motion.div>

        {/* FOOTNOTE */}
        <p className="text-sm text-slate-500 text-center py-4">
          ข้อมูลนี้เป็นเพียงการพยากรณ์ข้อมูลสภาพอากาศในระบบ EPCA Air Thai เท่านั้น
        </p>
      </div>
    </div>
  );
}
