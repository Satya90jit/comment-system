import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { fetchReplies, postReply } from "@/lib/firebaseUtils";
import { Comment } from "@/types/comment";
import CommentCard from "./CommentCard"; // Ensure the correct import path
import { useAuth } from "@/context/AuthContext";

const CommentsList = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const commentsData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const replies = await fetchReplies(doc.id);
              return {
                id: doc.id,
                ...doc.data(),
                replies,
              } as Comment;
            })
          );
          setComments(commentsData);
        } catch (err) {
          console.error("Error fetching comments: ", err);
          setError("Failed to load comments. Please try again later.");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handlePostReply = async (
    commentId: string,
    replyText: string,
    parentReplyId: string | null = null
  ) => {
    try {
      const replyData = {
        text: replyText,
        userName: user?.displayName || "Anonymous",
        userPhoto: user?.photoURL || "/default-avatar.png",
        createdAt: serverTimestamp(),
      };

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

      await addDoc(repliesRef, replyData);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          onPostReply={handlePostReply}
        />
      ))}
      {!user && (
        <div className="border border-gray-300 rounded-2xl p-6 flex flex-col items-center">
          <p className="text-center text-gray-500">
            Please sign in to post a reply.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
