"use client";

export default function PM25LevelBar({ pm25 }: { pm25: number }) {
  const ranges = [
    { max: 25, label: "ดี", color: "#22c55e" },
    { max: 37, label: "ปานกลาง", color: "#eab308" },
    { max: 50, label: "เริ่มมีผลกระทบ", color: "#facc15" },
    { max: 90, label: "มีผลกระทบต่อสุขภาพ", color: "#f97316" },
    { max: Infinity, label: "อันตราย", color: "#ef4444" },
  ];

  const level = ranges.find((r) => pm25 <= r.max)!;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">
        ระดับคุณภาพอากาศตามค่าที่วัดได้
      </h3>

      {/* แท่งสี */}
      <div className="flex w-full h-4 rounded-full overflow-hidden mb-4">
        <div className="flex-1 bg-green-500"></div>
        <div className="flex-1 bg-yellow-400"></div>
        <div className="flex-1 bg-yellow-300"></div>
        <div className="flex-1 bg-orange-500"></div>
        <div className="flex-1 bg-red-500"></div>
      </div>

      {/* ตัวชี้ตำแหน่ง */}
      <div className="relative w-full h-6">
        <div
          className="absolute -top-1 w-3 h-3 rounded-full border-2 border-white shadow"
          style={{
            left: `${Math.min(pm25, 120) / 1.2}%`,
            backgroundColor: level.color,
          }}
        ></div>
      </div>

      <p className="mt-3 text-slate-700">
        PM2.5 ขณะนี้:{" "}
        <span className="font-bold" style={{ color: level.color }}>
          {pm25.toFixed(2)}
        </span>{" "}
        µg/m³ — <span className="font-semibold">{level.label}</span>
      </p>
    </div>
  );
}
