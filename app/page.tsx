'use client';

import React, { useState, useEffect } from 'react';
import BangKhenMap from '../components/BangKhenMap';
import WeatherBox from '../components/WeatherBox';
import Forecast from '../components/Forecast';
import Calendar from '../components/Calenda';
import { LucideSearch, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PM25LevelBar from "../components/PM25LevelBar";

const API_BASE = 'http://127.0.0.1:8000';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

interface ForecastDay {
  date: string;
  pm25: number;
  temperature: number;
  humidity: number;
  pressure: number;
}

const HomePage = () => {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [customForecast, setCustomForecast] = useState<ForecastDay[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showForecastFromSearch, setShowForecastFromSearch] = useState(false);

  const [dashboardData, setDashboardData] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/current`)
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        setDashboardData(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/forecast`)
      .then((res) => res.json())
      .then((data) => setForecastData(data))
      .catch(console.error);
  }, []);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const addDays = (dateStr: string, offset: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + offset);
    return formatDate(d);
  };

  const handleSearch = async () => {
    if (!selectedDate) return alert('กรุณาเลือกวันที่ก่อน');

    try {
      const days: ForecastDay[] = [];

      for (let i = 0; i < 5; i++) {
        const dateStr = addDays(selectedDate, i);

        const res = await fetch(`${API_BASE}/predict_pm25_by_date`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateStr }),
        });

        const data = await res.json();

        if (data.error || data.detail) {
          alert('ไม่พบข้อมูลย้อนหลังเพียงพอสำหรับวันที่ ' + dateStr);
          return;
        }

        days.push({
          date: dateStr,
          pm25: data.predicted_pm25,
          temperature: data.temperature,
          humidity: data.humidity,
          pressure: data.pressure,
        });
      }

      const first = days[0];
      setDashboardData({
        pm25: first.pm25,
        temperature: first.temperature,
        humidity: first.humidity,
        pressure: first.pressure,
        date: first.date,
      });

      setCustomForecast(days);
      setShowForecastFromSearch(true);
    } catch (err) {
      console.error('Search error:', err);
      alert('เกิดข้อผิดพลาดระหว่างการพยากรณ์');
    }
  };

  if (!weatherData || !dashboardData) {
    return <p className="text-center text-gray-700 mt-16">กำลังโหลดข้อมูล...</p>;
  }

  const circleColor =
    dashboardData.pm25 <= 25
      ? '#22c55e'
      : dashboardData.pm25 <= 50
      ? '#eab308'
      : dashboardData.pm25 <= 100
      ? '#f97316'
      : '#ef4444';

  const listToShow =
    showForecastFromSearch && customForecast.length > 0
      ? customForecast
      : forecastData;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* HEADER */}
        <motion.div initial="initial" animate="animate" variants={fadeIn}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-sky-800">
            EPCA Air Thai
          </h1>
          <p className="text-gray-600">
            ระบบตรวจสอบคุณภาพอากาศ PM2.5 และข้อมูลสภาพอากาศ
          </p>
        </motion.div>

        {/* MAP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-md overflow-hidden"
        >
          <BangKhenMap pm25={dashboardData.pm25} />
        </motion.div>


        {/* SEARCH BAR */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-md px-5 py-4 flex flex-col md:flex-row items-center gap-3 relative"
        >
          <div className="w-full md:w-1/3 text-sm font-semibold text-slate-700">
            เลือกวันที่ต้องการ
          </div>

          <div className="flex-1 flex items-center gap-3 w-full">
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="
                flex-1 p-3 rounded-xl 
                bg-white border border-sky-300 shadow-sm
                focus:ring-2 focus:ring-sky-600 focus:outline-none
                text-gray-800 placeholder-gray-400
                z-10
              "
            />

            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="
                inline-flex items-center justify-center w-11 h-11
                rounded-xl bg-slate-100 hover:bg-slate-200
                text-slate-700 shadow-sm transition z-10
              "
            >
              <CalendarIcon size={20} />
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="
                inline-flex items-center justify-center px-5 h-11 rounded-xl
                bg-sky-600 hover:bg-sky-700 text-white font-semibold
                shadow-md transition gap-2 z-10
              "
            >
              <LucideSearch size={18} />
              <span>ค้นหา</span>
            </button>
          </div>

          {/* POPUP CALENDAR — PRO FLOAT RIGHT */}
          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 10 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 top-[110%] z-30"
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
        </motion.div>

        {/* DASHBOARD */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="bg-white rounded-3xl shadow-lg px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="w-64 h-64 rounded-full flex flex-col items-center justify-center text-white font-bold"
              style={{ backgroundColor: circleColor }}
              animate={{ scale: [0.96, 1, 0.98, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-5xl">{dashboardData.pm25.toFixed(2)}</div>
              <div className="text-lg mt-1">µg/m³</div>
            </motion.div>

            <p className="mt-5 text-lg text-slate-700">
              คุณภาพอากาศวันที่{' '}
              <span className="font-semibold text-sky-700">
                {dashboardData.date ?? 'ปัจจุบัน'}
              </span>
            </p>
          </div>

          <div className="grid gap-5">
            <WeatherBox title="อุณหภูมิ" value={dashboardData.temperature} unit="°C" />
            <WeatherBox title="ความชื้น" value={dashboardData.humidity} unit="%" />
            <WeatherBox title="ความกดอากาศ" value={dashboardData.pressure} unit="hPa" />
          </div>
        </motion.div>

        {/* LEVEL BAR */}
        <PM25LevelBar pm25={dashboardData.pm25} />


        {/* FORECAST 5 DAYS */}
        <motion.div initial="initial" animate="animate" variants={fadeIn} className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">
            คุณภาพอากาศในวันถัดไป
          </h2>
          <Forecast data={listToShow} />
        </motion.div>

        {/* FOOTNOTE */}
        <p className="text-sm text-slate-500 text-center py-4">
          ข้อมูลนี้เป็นเพียงการพยากรณ์ข้อมูลสภาพอากาศในระบบ EPCA Air Thai เท่านั้น
        </p>

      </main>
    </div>
  );
};

export default HomePage;
