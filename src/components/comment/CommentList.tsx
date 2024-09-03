import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

const CommentsList = () => {
  const [comments, setComments] = useState<any>([]);

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {comments.map((comment: any) => (
        <div key={comment.id} className="comment">
          <img src={comment.user.photoURL} alt={comment.user.displayName} />
          <div>
            <p>{comment.user.displayName}</p>
            <p>{comment.text}</p>
            {comment.imageUrl && (
              <img src={comment.imageUrl} alt="attachment" />
            )}
            <p>{comment.createdAt.toDate().toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
