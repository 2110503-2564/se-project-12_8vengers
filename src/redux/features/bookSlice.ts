import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationItem } from "../../../interface";

type BookState = {
  reservationItems : ReservationItem[];
};

const initialState: BookState = { reservationItems : [] };

export const bookSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<ReservationItem>) => {
      const replace = state.reservationItems .find
        (reservation => reservation.reserveDate === action.payload.reserveDate && reservation.coWorkingSpace === action.payload.coWorkingSpace)
      if (replace) {
        replace.user = action.payload.user;
      } else {
        state.reservationItems .push(action.payload);
      }
    },
    removeReservation: (state, action: PayloadAction<ReservationItem>) => {
      const RemainItems = state.reservationItems .filter((obj) => {
        return (
          (obj.reserveDate !== action.payload.reserveDate) ||
          (obj.user !== action.payload.user) ||
          (obj.coWorkingSpace !== action.payload.coWorkingSpace)
        );
      });
      state.reservationItems  = RemainItems;
    },
  },
});

export const { addReservation, removeReservation } = bookSlice.actions;
export default bookSlice.reducer;
