"use client";
import { useState } from "react";
import styles from "./banner.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Banner() {
  const covers = [
    "/img/cover.jpg",
    "/img/cover2.jpg",
    "/img/cover3.jpg",
    "/img/cover4.jpg",
  ];
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div
      className={`relative w-screen h-screen ${styles.banner}`}
      onClick={() => setIndex(index + 1)}
    >
      <Image
        src={covers[index % covers.length]}
        alt="cover"
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"
        style={{ backdropFilter: "blur(4px)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <h1
          className={`text-5xl text-white font-semibold font-mono bg-transparent ${styles.textshadow}`}
        >
          Where creativity meets collaboration
        </h1>
        <h3
          className={`text-2xl text-white font-medium font-sans bg-transparent ${styles.textshadow}`}
        >
          Empowering your ideas in a dynamic workspace.
        </h3>
        <button
          className="mt-6 bg-white font-semibold py-2 px-4 rounded z-30
                hover:bg-gray-800 hover:text-white hover:border-transparent"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/coworkingspace");
          }}
        >
          Select Co-Working Space
        </button>
      </div>
    </div>
  );
}
