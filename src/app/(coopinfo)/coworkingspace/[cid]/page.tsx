"use client";

import Image from "next/image";
import getCoworkingSpace from "@/libs/getCoworkingSpace";
import getReviewsByCoop from "@/libs/getReviewsByCoop";
import checkUserRatingStatus from "@/libs/checkUserRatingStatus";
import rateReservation from "@/libs/rateReservation";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CoopDetailPage({
  params,
}: {
  params: { cid: string };
}) {
  const { data: session } = useSession();
  const [coopDetail, setCoopDetail] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [hasReserved, setHasReserved] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const router = useRouter();
  const { cid } = useParams();

  const showSnackbar = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user.token) return;

      const [coopRes, reviewRes, ratingStatus] = await Promise.all([
        getCoworkingSpace(params.cid, session.user.token),
        getReviewsByCoop(session.user.token, params.cid),
        checkUserRatingStatus(params.cid, session.user.token),
      ]);

      setCoopDetail(coopRes.data);
      setReviews(reviewRes.data);
      setHasReserved(ratingStatus.hasReserved);
      setRating(ratingStatus.rating);
      setHasRated(ratingStatus.rating !== null);
    };

    fetchData();
  }, [session]);

  const handleRating = async (value: number | null) => {
    if (!session?.user.token || !hasReserved || value === null) return;

    await rateReservation(params.cid, value, session.user.token);
    setRating(value);

    if (hasRated) {
      showSnackbar("Your rating has been updated!");
    } else {
      showSnackbar("Rating submitted!");
    }
    setHasRated(true);
  };

  if (!session) {
    return (
      <main
        className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/background.avif')" }}
      >
        <div className="w-[20%] bg-red-600 p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 mx-auto my-20 font-bold text-2xl text-gray-800">
          Please Sign in
        </div>
      </main>
    );
  }

  if (!coopDetail)
    return (
      <main
        className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/background.avif')" }}
      >
        <div className="w-[20%] p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 mx-auto my-20 font-bold text-2xl text-white">
          Loading...
        </div>
      </main>
    );

  return (
    <main className="w-[80%] bg-white p-6 rounded-lg shadow-6xl flex flex-col space-y-4 border border-gray-300 mx-auto my-20">
      <h1 className="text-2xl font-bold">{coopDetail.name}</h1>
      <div className="flex flex-row my-5">
        <Image
          src="/img/mockimage.avif"
          alt="Coop Image"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg w-[30%]"
        />
        <div className="text-lg mx-5 text-left">
          <div>Name: {coopDetail.name}</div>
          <div>Address: {coopDetail.address}</div>
          <div>Tel: {coopDetail.tel}</div>
          <div>Open time: {coopDetail.open_time}</div>
          <div>Close time: {coopDetail.close_time}</div>
          <Link href="/reservation">
            <button className="rounded-md bg-blue-600 hover:bg-green-600 px-3 py-1 text-white shadow-sm text-md mr-3 mt-5">
              Make Reservation
            </button>
          </Link>

          {hasReserved ? (
            <div>
              <div className="mt-6">
                <div className="text-md font-semibold mb-1">
                  Rate this Space:
                </div>
                <Rating
                  value={rating}
                  onChange={(_, newVal) => handleRating(newVal)}
                />
              </div>
              <button
                className="rounded-md bg-yellow-500 hover:bg-yellow-600 px-3 py-1 hover:text-white shadow-sm text-sm"
                onClick={() => {
                  router.push(`/reviews/${cid}`);
                }}
              >
                Review
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">
              You must reserve before rating.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="mt-4">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review: any) => (
              <div
                key={review._id}
                className="mb-4 p-4 border rounded-lg shadow-md"
              >
                <div className="font-bold">{review.user.name}</div>
                <p className="text-xl font-serif text-gray-800 leading-relaxed">
                  {review.comment}
                </p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          severity="info"
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </main>
  );
}
