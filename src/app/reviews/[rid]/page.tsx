// "use client"; เพิ่มบรรทัดนี้ที่ด้านบนสุด
"use client";

import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { TextField, Button, Typography, Card, CardContent, Box, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import createReview from "@/libs/createReview";
import getReview from "@/libs/getReview";
import { editReview } from "@/libs/editReview"; // เพิ่มการ import editReview

export default function ReviewFormPage() {
  const router = useRouter();
  const { rid } = useParams();
  const { data: session } = useSession();

  const reservationId = Array.isArray(rid) ? rid[0] : rid;

  const [oldComments, setOldComments] = useState<any[]>([]);  // เปลี่ยนเป็น Array ที่มีข้อมูลรีวิว
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);  // สำหรับจัดการการแก้ไข
  const [editedText, setEditedText] = useState("");  // ค่าที่จะถูกแก้ไข

  useEffect(() => {
    console.log("⏳ useEffect called with:", { reservationId, session });

    if (reservationId && session?.user.token) {
      const fetchReview = async () => {
        try {
          console.log("📡 Fetching review for reservationId:", reservationId);

          const review = await getReview(session.user.token, reservationId);

          console.log("✅ Review fetched:", review);

          if (review?.data && Array.isArray(review.data)) {
            setOldComments(review.data);  // ใช้ข้อมูลที่ได้จาก backend
          }          
        } catch (err) {
          console.error("❌ Error fetching review:", err);
          setMessage("Failed to fetch review.");
        }
      };
      fetchReview();
    } else {
      console.log("🚫 reservationId or token is missing.");
    }
  }, [reservationId, session?.user.token]);

  const handleSubmit = async () => {
    console.log("🚀 Submitting review with:", {
      token: session?.user.token,
      reservationId,
      comment: newComment,
    });

    if (!reservationId) {
      setMessage("Reservation ID is required.");
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
        newComment
      );

      console.log("✅ Review created response:", res);

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
      await editReview(session?.user.token as string, editingComment as string, editedText);
      setMessage("Review updated successfully.");
      setEditingComment(null);
      setEditedText("");  // Clear the text after saving
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
      <Typography variant="h5" gutterBottom>
        Review Your Reservation
      </Typography>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* รีวิวเก่า */}
        <div className="md:w-1/2 border rounded-lg p-4 bg-gray-50">
          <Typography variant="h6" gutterBottom>
            Previous Reviews
          </Typography>

          {oldComments.length > 0 ? (
            oldComments.map((review, index) => (
              <Card key={review._id} variant="outlined" className="mb-4">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Review {index + 1} {/* เพิ่มลำดับรีวิว */}
                  </Typography>
                  <Typography variant="body1" className="whitespace-pre-line">
                    {review.comment}
                  </Typography>
                  <Button onClick={() => handleEdit(review._id, review.comment)}>Edit</Button>
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
            Write a New Review
          </Typography>
          <TextField
            label="New Comment"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="my-4"
          />

          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Submit Review
          </Button>

          {message && <p className="text-red-500 mt-3">{message}</p>}
        </div>
      </div>

      {/* Modal สำหรับการแก้ไขรีวิว */}
      <Modal open={Boolean(editingComment)} onClose={() => setEditingComment(null)}>
        <Box sx={{ p: 4, width: 400, backgroundColor: "white", margin: "auto" }}>
          <Typography variant="h6">Edit Review</Typography>
          <TextField
            label="Edit Comment"
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
