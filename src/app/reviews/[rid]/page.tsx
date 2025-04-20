"use client";

import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Modal,
} from "@mui/material";
import { useState, useEffect } from "react";
import createReview from "@/libs/createReview";
import getReview from "@/libs/getReview";
import { editReview } from "@/libs/editReview";
import getReservation from "@/libs/getReservation";

export default function ReviewFormPage() {
  const router = useRouter();
  const { rid } = useParams();
  const { data: session } = useSession();

  const reservationId = Array.isArray(rid) ? rid[0] : rid;

  const [coWorkingSpaceId, setCoWorkingSpaceId] = useState<string | null>(null);
  const [oldComments, setOldComments] = useState<any[]>([]); // เปลี่ยนเป็น Array ที่มีข้อมูลรีวิว
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null); // สำหรับจัดการการแก้ไข
  const [editedText, setEditedText] = useState(""); // ค่าที่จะถูกแก้ไข

  useEffect(() => {
    console.log("⏳ useEffect called with:", { reservationId, session });

    if (reservationId && session?.user.token) {
      const fetchReviewAndReservation = async () => {
        try {
          // 🔍 Fetch review
          console.log("📡 Fetching review for reservationId:", reservationId);
          const review = await getReview(session.user.token, reservationId);

          if (review?.data && Array.isArray(review.data)) {
            if (review.data.length === 0) {
              setMessage("You haven't written a review yet.");
              setOldComments([]);
            } else {
              setOldComments(review.data);
              setMessage("");
            }
          }

          console.log("✅ Review fetched:", review);

          // 🔍 Fetch reservation to get coWorkingSpaceId
          console.log("📡 Fetching reservation for coWorkingSpaceId...");
          const reservationData = await getReservation(
            reservationId,
            session.user.token
          );
          const coworkingId = reservationData?.data?.coWorkingSpace;

          if (coworkingId) {
            console.log("🏢 coWorkingSpaceId found:", coworkingId);
            setCoWorkingSpaceId(coworkingId);
          } else {
            console.warn("⚠️ coWorkingSpaceId not found in reservation.");
          }
        } catch (err) {
          console.error("❌ Error during fetch:", err);
          setMessage("Failed to fetch review or reservation.");
        }
      };

      fetchReviewAndReservation();
    } else {
      console.log("🚫 reservationId or token is missing.");
    }
  }, [reservationId, session?.user.token]);

  const handleSubmit = async () => {
    if (!reservationId || !coWorkingSpaceId) {
      setMessage("Missing reservation or coworking space ID.");
      return;
    }

    if (newComment.trim() === "") {
      setMessage("Please provide a comment.");
      return;
    }

    try {
      const res = await createReview(
        session?.user.token as string,
        reservationId,
        newComment,
        coWorkingSpaceId
      );

      if (res.success) {
        alert("Review submitted successfully!");
        router.push("/myreservation");
      } else {
        setMessage(res.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("❌ Unexpected error submitting review:", err);
      setMessage("An unexpected error occurred.");
    }
  };

  const handleEdit = (commentId: string, currentComment: string) => {
    setEditingComment(commentId);
    setEditedText(currentComment);
  };

  const handleSaveEdit = async () => {
    if (!editedText.trim()) {
      setMessage("Please provide a valid comment.");
      return;
    }

    try {
      await editReview(
        session?.user.token as string,
        editingComment as string,
        editedText
      );
      setMessage("Review updated successfully.");
      setEditingComment(null);
      setEditedText(""); // Clear the text after saving
      // You may need to re-fetch the reviews or update the local state after editing
    } catch (error) {
      setMessage("Failed to update review.");
      console.error(error);
    }
  };

  if (!reservationId || !session?.user.token) {
    console.log("⏳ Waiting for reservationId and token to load...");
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <div className="font-bold text-2xl mb-4">Add new Comments</div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* รีวิวเก่า */}
        <div className="md:w-1/2 border rounded-lg p-4 bg-gray-50">
          <div className="font-semibold text-xl mb-4">Your Comments</div>

          {oldComments.length > 0 ? (
            oldComments.map((review, index) => (
              <Card key={review._id} variant="outlined" className="mb-4">
                <CardContent>
                  <div className="whitespace-pre-line mb-2">
                    {review.comment}
                  </div>
                  <button
                    onClick={() => handleEdit(review._id, review.comment)}
                    className="px-2 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200"
                  >
                    Edit
                  </button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No reviews submitted yet.
            </Typography>
          )}
        </div>

        {/* รีวิวใหม่ */}
        <div className="md:w-1/2">
          <Typography variant="h6" gutterBottom>
            Write a New Comment
          </Typography>
          <div className="space-y-4">
            <TextField
              label="New Comment"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className=""
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Submit Review
            </Button>
          </div>

          {message && <p className="text-red-500 mt-3">{message}</p>}
        </div>
      </div>

      {/* Modal สำหรับการแก้ไขรีวิว */}
      <Modal
        open={Boolean(editingComment)}
        onClose={() => setEditingComment(null)}
      >
        <Box
          sx={{ p: 4, width: 400, backgroundColor: "white", margin: "auto" }}
        >
          <div className="font-semibold text-lg mb-4">Edit Comment</div>
          <TextField
            label="Content"
            multiline
            rows={4}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button onClick={() => setEditingComment(null)}>Cancel</Button>
            <Button color="primary" onClick={handleSaveEdit} sx={{ ml: 2 }}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </main>
  );
}
