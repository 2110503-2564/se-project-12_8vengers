// components/ReviewList.tsx
import React, { useState } from "react";
import { Button, Modal, TextField, Box, Typography } from "@mui/material";
<<<<<<< HEAD
import editReview from "@/libs/editReview";
=======
import  editReview  from "@/libs/editReview";
>>>>>>> 3a65141b7c5082437e5874492b8c40b1fe183629

interface Review {
  _id: string;
  reservationId: string;
  comment: string;
}

interface ReviewListProps {
  reviews: Review[];
  token: string | null;
  onReviewUpdated?: () => void;
}

function ReviewList({ reviews, token, onReviewUpdated }: ReviewListProps) {
  const [open, setOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleOpen = (review: Review) => {
    setCurrentReview(review);
    setUpdatedComment(review.comment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentReview(null);
  };

  const handleSave = async () => {
    if (!token) {
      console.error("Token is missing");
      return;
    }
    if (!currentReview || !currentReview.reservationId) {
      console.error("Reservation ID or review is missing");
      return;
    }

    setIsSaving(true);
    try {
      await editReview(token, currentReview._id, updatedComment);
      handleClose();
      onReviewUpdated?.();
    } catch (error) {
      console.error("Failed to update review", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.reservationId} style={{ marginBottom: "20px" }}>
          <Typography variant="body1">{review.comment}</Typography>
          <Button
            variant="outlined"
            onClick={() => handleOpen(review)}
            sx={{ mt: 1 }}
          >
            Edit
          </Button>
        </div>
      ))}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "relative", // ✅ ต้องใช้ relative เท่านั้น
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            pb: 8, // เผื่อช่องว่างให้ปุ่มล่างขวา
            boxShadow: 24,
            minWidth: 400,
            maxWidth: "80%",
            borderRadius: 2,
            outline: "none",
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Edit Review
          </Typography>
          <TextField
            label="Edit Comment"
            multiline
            rows={4}
            value={updatedComment}
            onChange={(e) => setUpdatedComment(e.target.value)}
            fullWidth
            margin="normal"
          />

          {/* ปุ่มล่างขวา */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
            }}
          >
            <Button
              onClick={handleClose}
              sx={{ mr: 1 }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={isSaving || !updatedComment.trim()}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default ReviewList;
