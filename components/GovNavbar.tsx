"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";

export default function GovNavbar() {
  const pathname = usePathname();

  const menu = [
    { name: "หน้าหลัก", href: "/" },
    { name: "ข้อมูลพยากรณ์", href: "/forecast" },
    { name: "แผนที่", href: "/map" },
  ];

  return (
    <header className="sticky top-0 z-[9999] bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-sky-600 flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900 text-sm">
              EPCA Air Thai
            </span>
            <span className="text-xs text-slate-500">
              ระบบตรวจสอบคุณภาพอากาศ
            </span>
          </div>
        </div>

        {/* RIGHT: MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  font-medium transition relative pb-1
                  ${active ? "text-sky-700" : "text-slate-600 hover:text-sky-700"}
                `}
              >
                {item.name}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] bg-sky-600 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}