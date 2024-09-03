import { CommentInputBox, CommentsList } from "@/components/comment";
import { Authentication } from "@/components/core";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    fetchTotalComments();
  }, []);

  const fetchTotalComments = async () => {
    try {
      const commentsRef = collection(db, "comments");
      const querySnapshot = await getDocs(commentsRef);
      setTotalComments(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };
  return (
    <section className="mx-auto lg:px-60 px-3 lg:my-14 my-3">
      <div className="mb-2 px-2">
        <Authentication />
      </div>
      <div className="border-2 border-gray-300 rounded-lg lg:p-8 p-5 space-y-6">
        <div className="flex justify-between">
          <h1 className="text-gray-800 text-xl font-medium">
            Comments({totalComments})
          </h1>
          <div className="bg-gray-200/40 border px-3 py-1 rounded-lg text-sm text-gray-600 flex gap-5">
            <span className="text-gray-700">Latest</span>
            <span>Popular</span>
          </div>
        </div>
        <CommentInputBox />
        <CommentsList />
      </div>
    </section>
  );
}
