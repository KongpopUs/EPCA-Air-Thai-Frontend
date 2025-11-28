interface WeatherBoxProps {
  title: string;
  value: string | number;
  unit?: string; // เพิ่ม props สำหรับหน่วย
}

const WeatherBox = ({ title, value, unit }: WeatherBoxProps) => {
  return (
    <div className="
      bg-white/90 
      backdrop-blur-sm 
      shadow-lg 
      rounded-xl 
      p-6 
      flex flex-col items-center justify-center 
      w-full h-36
      hover:scale-105 hover:shadow-2xl transition-all duration-300
    ">
      <h3 className="text-gray-500 text-lg font-medium">{title}</h3>

      {/* ตัวเลข + หน่วย */}
      <div className="flex items-baseline mt-3 space-x-2">
        <p className="text-4xl font-extrabold text-blue-700">{value}</p>
        {unit && <span className="text-lg font-semibold text-gray-500">{unit}</span>}
      </div>
      <div className="text-2xl font-bold">
        {typeof value === "number" ? value.toFixed(2) : value} {unit}
      </div>

    </div>
  );
};

export default WeatherBox;
