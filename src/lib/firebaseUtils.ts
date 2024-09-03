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

// Recursive function to fetch replies and their nested replies
export const fetchReplies = async (
  commentId: string,
  parentReplyId?: string
): Promise<Comment[]> => {
  let repliesRef;

  if (parentReplyId) {
    repliesRef = collection(
      db,
      "comments",
      commentId,
      "replies",
      parentReplyId,
      "replies"
    );
  } else {
    repliesRef = collection(db, "comments", commentId, "replies");
  }

  const q = query(repliesRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  const replies = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const replyData = {
        id: doc.id,
        ...doc.data(),
      } as Comment;

      // Recursively fetch nested replies
      const nestedReplies = await fetchReplies(commentId, doc.id);
      return {
        ...replyData,
        replies: nestedReplies, // Attach nested replies
      };
    })
  );

  return replies;
};

// Post a reply to a specific comment or reply
export const postReply = async (
  commentId: string,
  replyData: Omit<Comment, "id">,
  parentReplyId?: string
) => {
  let repliesRef;

  if (parentReplyId) {
    repliesRef = collection(
      db,
      "comments",
      commentId,
      "replies",
      parentReplyId,
      "replies"
    );
  } else {
    repliesRef = collection(db, "comments", commentId, "replies");
  }

  const replyWithTimestamp = {
    ...replyData,
    createdAt: Timestamp.fromDate(new Date()),
  };

  await addDoc(repliesRef, replyWithTimestamp);
};
