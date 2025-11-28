"use client";

interface Props {
  result: any;
  date: string;
}

export default function DashboardCard({ result, date }: Props) {
  return (
    <div className="w-full bg-white shadow-xl rounded-3xl p-10 border border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* วงกลม PM2.5 */}
      <div className="flex flex-col items-center justify-center">
        <div
          className="
            w-64 h-64 rounded-full flex flex-col items-center justify-center 
            text-white font-bold shadow-lg transition-all duration-700
          "
          style={{
            backgroundColor:
              result.pm25 <= 25
                ? "#38c172"
                : result.pm25 <= 50
                ? "#f6c800"
                : "#ef5350",
          }}
        >
          <div className="text-5xl">{result.pm25.toFixed(2)}</div>
          <div className="text-lg">µg/m³</div>
        </div>

        <p className="mt-6 text-lg text-gray-700 font-semibold">
          แสดงผลสำหรับวันที่{" "}
          <span className="text-sky-700 font-bold">{date}</span>
        </p>
      </div>

      {/* กล่องค่าต่าง ๆ */}
      <div className="flex flex-col gap-6 col-span-2">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow-md rounded-2xl border">
            <p className="text-gray-500 text-lg">อุณหภูมิ</p>
            <p className="text-4xl text-blue-700 font-bold">
              {result.temperature.toFixed(2)}{" "}
              <span className="text-gray-500 text-2xl">°C</span>
            </p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-2xl border">
            <p className="text-gray-500 text-lg">ความชื้น</p>
            <p className="text-4xl text-blue-700 font-bold">
              {result.humidity.toFixed(2)}{" "}
              <span className="text-gray-500 text-2xl">%</span>
            </p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-2xl border col-span-2">
            <p className="text-gray-500 text-lg">ความกดอากาศ</p>
            <p className="text-4xl text-blue-700 font-bold">
              {result.pressure.toFixed(2)}{" "}
              <span className="text-gray-500 text-2xl">hPa</span>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
