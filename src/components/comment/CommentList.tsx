import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { fetchReplies, postReply } from "@/lib/firebaseUtils";
import { Comment } from "@/types/comment";
import CommentCard from "../cards/CommentCard"; // Ensure the correct import path
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

  const handlePostReply = async (commentId: string, replyText: string) => {
    if (!user) {
      setError("You must be signed in to post a reply.");
      return;
    }

    const replyData: Omit<Comment, "id"> = {
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL || "/default-avatar.png",
      text: replyText,
      imageUrl: null,
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
        toDate: () => new Date(),
      },
    };

    try {
      await postReply(commentId, replyData);
    } catch (err) {
      console.error("Error posting reply: ", err);
      setError("Failed to post reply. Please try again.");
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
