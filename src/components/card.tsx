interface CardProps {
  title: string;
  count: string;
  icon?: React.ElementType;
  background: string;
}

export default function Card({ title, count, icon: Icon, background }: CardProps) {
  return (
    <div
      className="relative flex flex-col w-64 h-42 rounded-xl justify-between shadow-lg overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* آیکون بزرگ و نیمه‌شفاف */}
      <div className="absolute left-[-10px] bottom-[-15px] opacity-50 text-[#dbdbdb] pointer-events-none">
        {/* <Icon size={140} strokeWidth={1.25} /> */}
      </div>

      {/* محتوای کارت */}
      <div className="relative z-10 flex flex-col justify-between h-full p-5">
        <span className="text-3xl font-extrabold text-white text-center">
          {count}
        </span>
        <span className="text-xl text-white text-center opacity-90">
          {title}
        </span>
      </div>
    </div>
  );
}