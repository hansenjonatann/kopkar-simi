"use client";

interface DashboardCardProps {
  title: string;
  content: string;
}
export default function DashboardCard({ title, content }: DashboardCardProps) {
  return (
    <div className="bg-primary w-full h-[100px] shadow-lg rounded-lg">
      <div className="flex flex-col text-white">
        <h1 className="text-center text-xl font-bold m-3">{title}</h1>
        <h1 className="text-center text-xl text-green-300 font-bold mt-2">
          <span>{content}</span>
        </h1>
      </div>
    </div>
  );
}
