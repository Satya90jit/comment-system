import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebaseConfig";
import { CircularProgress } from "@mui/material";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { Close } from "@mui/icons-material";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface CommentData {
  text: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  imageUrl: string;
  createdAt: Timestamp;
  reactions: Record<string, number>;
}

const CommentInputBox: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuth();

  const modules = {
    toolbar: [["bold", "italic", "underline"], ["link"]],
    clipboard: { matchVisual: false },
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handlePostComment = async () => {
    if (value.trim() === "" || value.length > 250) {
      setError("Comment must be between 1 and 250 characters.");
      return;
    }

    if (!user) {
      setError("You must be signed in to post a comment.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      if (image) {
        const storageRef = ref(storage, `comments/${user.uid}/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          });
        });
      }

      const commentData: CommentData = {
        text: value,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL,
        imageUrl,
        createdAt: Timestamp.now(),
        reactions: { like: 0, love: 0, laugh: 0 },
      };

      await addDoc(collection(db, "comments"), commentData);

      setValue("");
      setImage(null);
    } catch (error) {
      console.error("Error posting comment: ", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="border border-gray-300 rounded-2xl p-6 flex flex-col relative">
        <p className="text-center text-gray-500">
          Please sign in to post a comment.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-2xl p-6 flex flex-col relative">
      <ReactQuill
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="Write a comment..."
        className="custom-quill border-b border-gray-800 outline-none"
      />
      <div className="mt-4 flex items-center space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="upload-image"
        />
        <label
          htmlFor="upload-image"
          className="cursor-pointer bg-gray-200 px-4 py-1 text-md rounded-lg border border-gray-300 text-gray-700"
        >
          Upload Image
        </label>
        {image && (
          <div className="relative">
            <Image
              src={URL.createObjectURL(image)}
              alt="Selected image"
              width={80}
              height={80}
              className="rounded-lg border p-1 min-h-16"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 rounded-full bg-white border border-gray-300 text-red-500"
            >
              <Close />
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="flex justify-end mt-4">
        <button
          onClick={handlePostComment}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={16} className="text-white" />
          ) : (
            "Post Comment"
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentInputBox;
