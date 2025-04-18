
export interface CoWorkingSpaceItem {
  _id: string;
  name: string;
  address: string;
  tel: string;
  open_time: string;
  close_time: string;
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
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  tel: string;
  createdAt: Date;
}
