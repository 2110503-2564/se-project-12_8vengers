
export interface CoWorkingSpaceItem {
  _id: string;
  name: string;
  address: string;
  tel: string;
  open_time: string;
  close_time: string;
  price: string;
  desc: string;
}

export interface CoWorkingSpaceJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: CoWorkingSpaceItem[];
}

export interface ReservationItem {
  _id: string;
  user: User;
  reserveDate: Date;
  coWorkingSpace: CoWorkingSpaceItem;
  rating?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  tel: string;
  createdAt: Date;
}

export interface Review {
  _id: string;
  user: string | User;
  reservationId: string | ReservationItem;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

