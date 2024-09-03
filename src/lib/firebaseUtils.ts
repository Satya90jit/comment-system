import { Comment } from "@/types/comment";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Fetch replies for a specific comment
export const fetchReplies = async (commentId: string): Promise<Comment[]> => {
  const repliesRef = collection(db, "comments", commentId, "replies");
  const q = query(repliesRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
};

// Post a reply to a specific comment
export const postReply = async (
  commentId: string,
  replyData: Omit<Comment, "id">
) => {
  const repliesRef = collection(db, "comments", commentId, "replies");
  const replyWithTimestamp = {
    ...replyData,
    createdAt: Timestamp.fromDate(new Date()),
  };
  await addDoc(repliesRef, replyWithTimestamp);
};
