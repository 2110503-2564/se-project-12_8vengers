import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { Link } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div className="h-[50px] bg-gray-800 fixed top-0 left-0 justify-end right-0 z-30 flex flex-rowitems-center px-4">
  
      {session ? (
        <Link href="/api/auth/signout">
          <div className="flex items-center absolute left-0 h-full px-5 rounded
          text-white text-sm font-semibold bg-gray-700 hover:text-black hover:bg-gray-300">
            Sign out
          </div>
        </Link>

        
      ) : (
        <div className="flex gap-2 absolute left-0 h-full">
          <Link href="/api/auth/signin">
            <div className="flex items-center px-5 text-white text-sm font-semibold 
            rounded bg-gray-700 h-full hover:text-black hover:bg-gray-300">
              Sign in
            </div>
          </Link>
          <Link href="/register">
            <div className="flex items-center px-5 text-white text-sm font-semibold 
            rounded bg-gray-700 h-full hover:text-black hover:bg-gray-300">
              Register
            </div>
          </Link>
        </div>
      )}
      <TopMenuItem title="My Reservation" pageRef="/myreservation" />

      <TopMenuItem title="Reservation" pageRef="/reservation" />
      <Link key="home" href="/">
        <Image
          src={"/img/logo.png"}
          className="h-[100%] w-auto"
          alt="logo"
          width={0}
          height={0}
          sizes="100vh"
        />
      </Link>
    </div>
  );
}
