"use client";

import { useEffect, useState } from "react";
import Forecast from "../../components/Forecast";
import Calendar from "../../components/Calenda";
import { Calendar as CalendarIcon, LucideSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PM25LevelBar from "../forecast/PM25LevelBar";

const API_BASE = "http://127.0.0.1:8000";

// ------------------------------
// ฟังก์ชันข้อความแจ้งเตือน + คำแนะนำ
// ------------------------------
function getPM25Info(pm25: number) {
    if (pm25 <= 25) {
        return {
            label: "ดีมาก",
            color: "#22c55e",
            messages: [
                "คุณภาพอากาศอยู่ในเกณฑ์ดีมาก สามารถทำกิจกรรมนอกอาคารได้ตามปกติ",
                "สภาพอากาศปลอดโปร่ง เหมาะสำหรับการเดินทางและการออกกำลังกายกลางแจ้ง",
                "ปริมาณฝุ่นอยู่ในระดับปลอดภัย ไม่ส่งผลกระทบต่อสุขภาพของประชาชนทั่วไป",
                "เหมาะสำหรับกิจกรรมกลางแจ้งระยะยาว เช่น วิ่ง ปั่นจักรยาน หรือเดินเล่น"
            ],
            advice: [
                "ออกกำลังกายกลางแจ้งได้เต็มที่",
                "เปิดหน้าต่างเพื่อให้อากาศถ่ายเท",
                "ไม่จำเป็นต้องสวมหน้ากากในที่โล่ง",
                "ประชาชนทุกกลุ่มสามารถใช้ชีวิตได้ตามปกติ"
            ]
        };
    }

    if (pm25 <= 37) {
        return {
            label: "ปานกลาง",
            color: "#eab308",
            messages: [
                "คุณภาพอากาศอยู่ในระดับปานกลาง อาจเริ่มมีผลกระทบบ้างสำหรับผู้ที่แพ้ง่าย",
                "ยังสามารถทำกิจกรรมนอกอาคารได้ตามปกติ",
                "ผู้ที่เป็นภูมิแพ้หรือโรคทางเดินหายใจควรระวังเล็กน้อย",
            ],
            advice: [
                "ทำกิจกรรมนอกอาคารได้ตามปกติ",
                "ผู้แพ้ง่ายควรพกหน้ากากไว้",
                "หลีกเลี่ยงพื้นที่ที่มีควันหรือมลพิษสูง",
                "ควรติดตามคุณภาพอากาศหากมีการเปลี่ยนแปลง"
            ]
        };
    }

    if (pm25 <= 50) {
        return {
            label: "เริ่มมีผลกระทบ",
            color: "#facc15",
            messages: [
                "คุณภาพอากาศเริ่มมีผลกระทบต่อสุขภาพ ควรลดเวลาในการทำกิจกรรมนอกอาคาร",
                "บางคนอาจมีอาการแสบตา ไอ หรือระคายเคือง",
                "ควรติดตามค่าฝุ่นเป็นระยะหากต้องอยู่นอกบ้านนาน",
            ],
            advice: [
                "สวมหน้ากากเมื่อออกนอกบ้าน",
                "ลดกิจกรรมนอกอาคาร โดยเฉพาะกิจกรรมที่ใช้แรงมาก",
                "เปิดเครื่องฟอกอากาศภายในอาคาร",
                "ปิดประตูหน้าต่างหากอยู่ใกล้ถนนใหญ่"
            ]
        };
    }

    if (pm25 <= 90) {
        return {
            label: "มีผลกระทบต่อสุขภาพ",
            color: "#f97316",
            messages: [
                "คุณภาพอากาศอยู่ในระดับไม่ดี ส่งผลต่อสุขภาพของประชาชนทั่วไป",
                "ควรจำกัดกิจกรรมนอกอาคารโดยไม่จำเป็น",
                "กลุ่มเสี่ยงควรอยู่ภายในอาคารให้มากที่สุด",
            ],
            advice: [
                "สวมหน้ากาก N95 ทุกครั้งเมื่อออกนอกบ้าน",
                "หลีกเลี่ยงการออกกำลังกายนอกอาคาร",
                "ใช้เครื่องฟอกอากาศแบบ HEPA",
                "ปิดประตู–หน้าต่างเพื่อป้องกันฝุ่นเข้าบ้าน"
            ]
        };
    }

    return {
        label: "อันตราย",
        color: "#ef4444",
        messages: [
            "คุณภาพอากาศอยู่ในระดับอันตราย มีผลต่อสุขภาพของทุกคน",
            "ควรหลีกเลี่ยงการออกนอกอาคารทุกกรณี",
            "กลุ่มเสี่ยงและผู้มีโรคประจำตัวควรเพิ่มความระมัดระวังสูงสุด",
        ],
        advice: [
            "งดกิจกรรมนอกอาคารทันที",
            "สวมหน้ากาก N95 หากจำเป็นต้องออกนอกบ้าน",
            "อยู่ในอาคารที่มีระบบกรองอากาศ",
            "เด็ก ผู้สูงอายุ และผู้ป่วยควรอยู่ในพื้นที่ปลอดฝุ่น"
        ]
    };
}

// ------------------------------
// MAIN PAGE
// ------------------------------
export default function ForecastPage() {
    const [forecastData, setForecastData] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [customForecast, setCustomForecast] = useState([]);

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

                {/* ---------------------------- */}
                {/* ข้อความแจ้งเตือน + คำแนะนำ */}
                {/* ---------------------------- */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {(() => {
                        const info = getPM25Info(display[0]?.pm25 || 0);

                        return (
                            <>
                                <h3
                                    className="text-xl font-bold mb-3"
                                    style={{ color: info.color }}
                                >
                                    ระดับคุณภาพอากาศ: {info.label}
                                </h3>

                                <p className="font-semibold text-slate-700 mb-2">
                                    ข้อความแจ้งเตือน:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-slate-700">
                                    {info.messages.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))}
                                </ul>

                                <p className="font-semibold text-slate-700 mt-4 mb-2">
                                    คำแนะนำ:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-slate-700">
                                    {info.advice.map((a, i) => (
                                        <li key={i}>{a}</li>
                                    ))}
                                </ul>
                            </>
                        );
                    })()}
                </div>

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