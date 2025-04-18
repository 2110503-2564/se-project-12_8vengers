import CoWorkingSpaceList from "@/components/CoWorkingSpaceList";
import getCoWorkingSpaces from "@/libs/getCoWorkingSpaces";
import { LinearProgress } from "@mui/material";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function CoWorkingSpaceInfo() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token)
    return (
      <main className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/background.avif')" }}>
        <div className="w-[20%] bg-red-600 p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 mx-auto my-20 font-bold text-2xl text-gray-800">
          Please Sign in
        </div>
      </main>
    );

  const coops = await getCoWorkingSpaces(session.user.token);

  return (
    <main className="w-[80%] bg-white p-6 rounded-lg shadow-6xl flex flex-col
     space-y-4 border border-gray-300 mx-auto my-20">
      <div className="font-bold text-2xl text-center mb-4">
        Select your Co-Working Space
      </div>
      <Suspense
        fallback={
          <p>
            Loading ... <LinearProgress />{" "}
          </p>
        }
      >
        <CoWorkingSpaceList coopJson={coops} />
      </Suspense>
    </main>
  );
}
