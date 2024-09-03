import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const addComment = async ({ commentText, user, imageUrl = null }: any) => {
  try {
    await addDoc(collection(db, "comments"), {
      text: commentText,
      user: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      imageUrl,
      createdAt: Timestamp.fromDate(new Date()),
      likes: 0,
      replies: [],
    });
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};
