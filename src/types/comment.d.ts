export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

export interface Comment {
  id: string;
  userName: string;
  userPhoto: string | null;
  text: string;
  imageUrl: string | null;
  createdAt: Timestamp;
  replies?: Comment[];
}
