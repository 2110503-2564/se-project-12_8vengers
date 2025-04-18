"use client";
import InteractiveCard from "./InteractiveCard";
import Image from "next/image";

export default function Card({
  coopName,
  address,
  tel,
  open_time,
  close_time,
}: {
  coopName: string;
  address: string;
  tel: string;
  open_time: string;
  close_time: string;
}) {
  return (
    <InteractiveCard>
      <div className="w-full h-full p-[10px] border border-black rounded hover:border-gray-400">
        <div className="font-semibold text-gray-800">{coopName}</div>
        <div className="text-sm m-1">Address : {address}</div>
        <div className="text-sm m-1">Tel. : {tel}</div>
        <div className="text-sm m-1">Open Time: {open_time}</div>
        <div className="text-sm m-1">Close Time: {close_time}</div>
        <Image
          src="/img/mockimage.avif"
          alt="Coop Image"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded w-full mt-2"
        />
      </div>
    </InteractiveCard>
  );
}
