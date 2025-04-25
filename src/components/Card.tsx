"use client";
import InteractiveCard from "./InteractiveCard";
import Image from "next/image";

export default function Card({
  coopName,
  address,
  tel,
  open_time,
  close_time,
  price,
  desc,
}: {
  coopName: string;
  address: string;
  tel: string;
  open_time: string;
  close_time: string;
  price: string;
  desc: string;
}) {
  return (
    <InteractiveCard>
      <div className="flex flex-col h-full border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        {/* รูปภาพ + ราคา overlay */}
        <div className="relative w-full h-40">
          <Image
            src="/img/mockimage.avif"
            alt="Coop Image"
            fill
            className="object-cover"
          />
          {/* ป้ายราคา */}
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
            ฿ {price} /hr
          </div>
        </div>

        {/* ข้อมูลอื่น ๆ */}
        <div className="p-4 flex flex-col gap-1 text-sm">
          <div className="text-base font-semibold text-gray-800">{coopName}</div>
          <div>📍 {address}</div>
          <div>📞 {tel}</div>
          <div>🕒 {open_time} - {close_time}</div>
          <div className="text-gray-600">{desc}</div>
        </div>
      </div>
    </InteractiveCard>
  );
}
