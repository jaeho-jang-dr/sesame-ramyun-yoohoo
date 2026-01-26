import Timetable from "@/components/features/Timetable";

export default function TimetablePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
          <span className="text-sesame-gold">우리 반</span>{" "}
          <span className="text-yoohoo-pink">시간표</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          이번 주에는 어떤 재미있는 수업이 있을까요?
        </p>
      </div>
      
      <Timetable />
    </div>
  );
}
