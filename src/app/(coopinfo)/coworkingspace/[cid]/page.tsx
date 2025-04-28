'use client'

import Image from "next/image";
import getCoworkingSpace from "@/libs/getCoworkingSpace";
import getReviewsByCoop from "@/libs/getReviewsByCoop";
import checkUserRatingStatus from "@/libs/checkUserRatingStatus";
import rateReservation from "@/libs/rateReservation";
import getAverageRating from "@/libs/avgRating";
import Link from "next/link";
import Rating from '@mui/material/Rating';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoopDetailPage({ params }: { params: { cid: string } }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [coopDetail, setCoopDetail] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [hasReserved, setHasReserved] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);

  const showSnackbar = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const fetchAllData = async () => {
    if (!session?.user.token) return;

    const [coopRes, reviewRes, ratingStatus, avgRes] = await Promise.all([
      getCoworkingSpace(params.cid, session.user.token),
      getReviewsByCoop(session.user.token, params.cid),
      checkUserRatingStatus(params.cid, session.user.token),
      getAverageRating(params.cid, session.user.token),
    ]);

    setCoopDetail(coopRes.data);
    setReviews(reviewRes.data);
    setHasReserved(ratingStatus.hasReserved);
    setRating(ratingStatus.rating);
    setHasRated(ratingStatus.rating !== null);
    setAverageRating(avgRes.average);
    setRatingCount(avgRes.count);
  };

  useEffect(() => {
    fetchAllData();
  }, [session]);

  const handleRating = async (value: number | null) => {
    if (!session?.user.token || !hasReserved || value === null) return;

    await rateReservation(params.cid, value, session.user.token);
    setRating(value);
    setHasRated(true);
    showSnackbar("Rating submitted!");

    // ✅ Refresh avg rating and review list
    const [newAvg, newReviews] = await Promise.all([
      getAverageRating(params.cid, session.user.token),
      getReviewsByCoop(session.user.token, params.cid),
    ]);

    setAverageRating(newAvg.average);
    setRatingCount(newAvg.count);
    setReviews(newReviews.data);
  };

  const handleReview = () => {
    router.push(`/reviews/${params.cid}`);
  };

  if (!session) {
    return (
      <main className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/background.avif')" }}>
        <div className="w-[20%] bg-red-600 p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 mx-auto my-20 font-bold text-2xl text-gray-800">
          Please Sign in
        </div>
      </main>
    );
  }

  if (!coopDetail) return <p className="text-center text-xl text-white font-semibold my-40">Loading...</p>;

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
          className="rounded-lg w-[40%] h-[420px] object-cover"
        />
        <div className="text-lg mx-5 text-left">
          <div>Name: {coopDetail.name}</div>
          <div>Address: {coopDetail.address}</div>
          <div>Tel: {coopDetail.tel}</div>
          <div>Open time: {coopDetail.open_time}</div>
          <div>Close time: {coopDetail.close_time}</div>
          <div>Price: {coopDetail.price} /hour</div>
          <div>Description: {coopDetail.desc}</div>
          <Link href="/reservation">
            <button className="rounded-md bg-blue-600 hover:bg-green-600 px-3 py-1 text-white shadow-sm text-md mr-3 mt-5">
              Make Reservation
            </button>
          </Link>

          {/* ⭐ แสดง average rating */}
          <div className="mt-4 text-md text-gray-700">
            ⭐Average Rating: <span className="font-semibold">{averageRating.toFixed(1)} / 5</span> ({ratingCount} ratings)
          </div>

          {/* ✅ เฉพาะคนที่เคยจอง */}
          {hasReserved && (
            <div className="mt-4">
              <div className="text-md font-semibold mb-1">Rate this Space:</div>
              <Rating
                value={rating}
                onChange={(_, newVal) => handleRating(newVal)}
              />
              <div>
                <button
                  onClick={handleReview}
                  className="mt-3 px-4 py-2 bg-yellow-500 hover:text-white rounded-md hover:bg-yellow-700 text-sm"
                >
                  Write a Review
                </button>
              </div>
            </div>
          )}

          {!hasReserved && (
            <p className="text-sm text-gray-500 mt-4">You must reserve before rating or reviewing.</p>
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
              <div key={review._id} className="mb-4 p-4 border rounded-lg shadow-md">
                <div className="font-bold">{review.user.name}</div>
                <p className="text-xl font-serif text-gray-800 leading-relaxed">{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <MuiAlert severity="success" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </main>
  );
}

