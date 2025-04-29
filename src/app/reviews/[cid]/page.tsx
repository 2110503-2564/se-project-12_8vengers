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
import editReview from "@/libs/editReview";
import deleteReview from "@/libs/deleteReview";

export default function ReviewFormPage() {
  const router = useRouter();
  const { cid } = useParams();
  const { data: session } = useSession();

  const coWorkingSpaceId = Array.isArray(cid) ? cid[0] : cid;

  const [oldComments, setOldComments] = useState<any[]>([]); // เปลี่ยนเป็น Array ที่มีข้อมูลรีวิว
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null); // สำหรับจัดการการแก้ไข
  const [editedText, setEditedText] = useState(""); // ค่าที่จะถูกแก้ไข

  useEffect(() => {
    console.log("⏳ useEffect called with:", { coWorkingSpaceId, session });

    if (coWorkingSpaceId && session?.user.token) {
      const fetchReview = async () => {
        try {
          // 🔍 Fetch review
          console.log("📡 Fetching review for coWorkingSpaceId:", coWorkingSpaceId);
          const review = await getReview(session.user.token, coWorkingSpaceId);

          if (review?.data && Array.isArray(review.data)) {
            if (review.data.length === 0) {
              setMessage("You haven't written a review yet.");
              setOldComments([]);
            } else {
              setOldComments(review.data);
              setMessage("");
            }
          }

        } catch (err) {
          console.error("❌ Error during fetch:", err);
          setMessage("Failed to fetch review");
        }
      };

      fetchReview();
    } else {
      console.log("🚫 reservationId or token is missing.");
    }
  }, [coWorkingSpaceId, session?.user.token]);

  const handleSubmit = async () => {
    if (!coWorkingSpaceId) {
      setMessage("Missing coworking space ID.");
      return;
    }

    if (newComment.trim() === "") {
      setMessage("Please provide a comment.");
      return;
    }

    try {
      const res = await createReview(
        session?.user.token as string,
        newComment,
        coWorkingSpaceId
      );

      if (res.success) {
        alert("Review submitted successfully!");
        setMessage("Review submitted successfully!");
        setTimeout(() => {
          router.push("/coworkingspace/" + coWorkingSpaceId);
        }, 2500);
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
      
      setEditingComment(null);
      setEditedText("");

      setMessage("Review updated successfully.");
      setTimeout(() => {
        router.push("/coworkingspace/" + coWorkingSpaceId);
      }, 2500);

      // รีเฟรชรีวิวหลังจาก setTimeout หรือ ทำแบบแยกกันก็ได้
      if (session) {
        const refresh = await getReview(session.user.token, coWorkingSpaceId);
      
        if (refresh?.data && Array.isArray(refresh.data)) {
          if (refresh.data.length === 0) {
            setOldComments([]);
          } else {
            setOldComments(refresh.data);
          }
        }
      }
    } catch (error) {
      setMessage("Failed to update review.");
      console.error(error);
    }
  };
  

  const handleDelete = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await deleteReview(
          session?.user.token as string,
          commentId
        );

        if (response.ok) {
          setOldComments((prev) =>
            prev.filter((review) => review._id !== commentId)
          );
          alert("Review deleted successfully!");
        } else {
          alert("Failed to delete review.");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("An error occurred while deleting the review.");
      }
    }
  };

  if (!coWorkingSpaceId || !session?.user.token) {
    console.log("⏳ Waiting for coWorkingSpaceId and token to load...");
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto mt-20 bg-white p-6 rounded-lg shadow-md">
      <div className="font-bold text-2xl mb-4">Add new Comments</div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* รีวิวเก่า */}
        <div className="md:w-1/2 border rounded-lg p-4 bg-gray-50">
          <div className="font-semibold text-xl mb-4">Your Comments</div>

          {oldComments.length > 0 ? (
            oldComments.map((review, index) => (
              <Card key={review._id} variant="outlined" className="mb-4">
                <CardContent>
                  <div className="whitespace-pre-line text-lg mb-2">
                    {review.comment}
                  </div>
                  <button
                    onClick={() => handleEdit(review._id, review.comment)}
                    className="px-3 py-1 mr-1 bg-white text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-3 py-1 mr-1 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  >
                    Delete
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
              name="comment"
              onChange={(e) => setNewComment(e.target.value)}
              className=""
            />

            <Button
              variant="contained"
              name="submitcomment"
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
            name="editcomment"
            multiline
            rows={4}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button onClick={() => setEditingComment(null)}>Cancel</Button>
            <Button color="primary" name="save" onClick={handleSaveEdit} sx={{ ml: 2 }}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </main>
  );
}
