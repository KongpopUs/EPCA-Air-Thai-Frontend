"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ pm25, temperature, humidity, fullScreen = false }) {
  const mapRef = useRef(null);

  // ฟังก์ชันเลือกสีตามระดับ PM2.5
  const getPmColor = (pm: number) => {
    if (pm <= 25) return "#22c55e"; // เขียว
    if (pm <= 50) return "#eab308"; // เหลือง
    if (pm <= 100) return "#f97316"; // ส้ม
    return "#ef4444"; // แดง
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([13.866, 100.604], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
    }).addTo(map);

    // วงกลมใหญ่พร้อม Pulse Animation
    const circleColor = getPmColor(pm25);

    const animatedCircle = L.circle([13.866, 100.604], {
      radius: 350,
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 0.45,
      weight: 2,
    }).addTo(map);

    // ทำ Pulse Animation
    let grow = true;
    setInterval(() => {
      const r = animatedCircle.getRadius();
      animatedCircle.setRadius(grow ? r + 20 : r - 20);
      grow = !grow;
    }, 800);

    // Tooltip แสดงข้อมูล PM + สภาพอากาศ
    animatedCircle.bindTooltip(
      `
        <div style="font-size:14px; padding:4px;">
          <b>คุณภาพอากาศ</b><br/>
          PM2.5: <b>${pm25.toFixed(2)}</b> µg/m³<br/>
        </div>
      `,
      { sticky: true }
    );

    return () => map.remove();
  }, [pm25, temperature, humidity]);

  return (
    <div
      ref={mapRef}
      className={
        fullScreen
          ? "w-full h-full"
          : "w-full h-96 rounded-3xl overflow-hidden shadow"
      }
    />
  );
}
