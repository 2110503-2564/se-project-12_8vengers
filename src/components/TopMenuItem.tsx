import Link from "next/link";

export default function TopMenuItem({ title, pageRef }: { title: string; pageRef: string }) {
  return (
    <Link
      href={pageRef}
      className="w-[120px] h-full flex items-center 
      justify-center text-center text-sm text-white rounded font-medium bg-gray-700 p-2 ml-3 mr-3 hover:text-black hover:bg-gray-300"
    >
      {title}
    </Link>
  );
}
