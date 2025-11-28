"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
      <span className="text-gray-600">กำลังโหลดแผนที่...</span>
    </div>
  ),
});

export default function BangKhenMap({ pm25, fullScreen = false }) {
  return (
    <div className={fullScreen ? "w-full h-full" : "w-full rounded-2xl overflow-hidden shadow-lg"}>
      <LeafletMap
        pm25={pm25}
        fullScreen={fullScreen}
      />
    </div>
  );
}
