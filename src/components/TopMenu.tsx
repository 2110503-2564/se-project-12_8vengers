import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { Link } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CgProfile } from "react-icons/cg";
import NextLink from "next/link";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div className="h-[50px] bg-gray-800 fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5">

      {/* ซ้าย: Logo + เมนู */}
      <div className="flex items-center space-x-4">
        <NextLink href="/">
          <Image
            src={"/img/logo.png"}
            className="h-[40px] w-auto"
            alt="logo"
            width={0}
            height={0}
            sizes="100vh"
          />
        </NextLink>
        <TopMenuItem title="My Reservation" pageRef="/myreservation" />
        <TopMenuItem title="Reservation" pageRef="/reservation" />
      </div>

      {/* ขวา: ปุ่ม Auth */}
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <NextLink href="/api/auth/signout">
              <div className="flex items-center px-4 py-2 rounded text-white text-sm font-semibold bg-gray-700 hover:text-black hover:bg-gray-300 cursor-pointer">
                Sign out
              </div>
            </NextLink>
            <NextLink href="/profile">
              <div className="flex items-center px-4 py-2 rounded text-white text-lg bg-gray-700 hover:text-black hover:bg-gray-300 cursor-pointer">
                <CgProfile />
              </div>
            </NextLink>
          </>
        ) : (
          <>
            <NextLink href="/api/auth/signin">
              <div className="flex items-center px-4 py-2 rounded text-white text-sm font-semibold bg-gray-700 hover:text-black hover:bg-gray-300 cursor-pointer">
                Sign in
              </div>
            </NextLink>
            <NextLink href="/register">
              <div className="flex items-center px-4 py-2 rounded text-white text-sm font-semibold bg-gray-700 hover:text-black hover:bg-gray-300 cursor-pointer">
                Register
              </div>
            </NextLink>
          </>
        )}
      </div>
    </div>
  );
}
