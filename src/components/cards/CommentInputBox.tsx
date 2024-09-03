import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebaseConfig";
import { CircularProgress } from "@mui/material";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const users = [
  { id: "1", username: "satya" },
  { id: "2", username: "ram nath" },
  { id: "3", username: "minister" },
  { id: "4", username: "world" },
  { id: "5", username: "hello" },
  { id: "6", username: "nothing" },
  // Add more users as needed
];

const CommentInputBox = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>([]);
  const [tagging, setTagging] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [image, setImage] = useState<File | null>(null); // To store the selected file
  const { user }: any = useAuth();
  const quillRef = useRef<any | null>(null);

  const modules = {
    toolbar: [["bold", "italic", "underline"], ["link"]],
    clipboard: {
      matchVisual: false,
    },
  };

  useEffect(() => {
    if (currentTag.startsWith("@")) {
      const query = currentTag.slice(1).toLowerCase();
      setSuggestions(
        users.filter((u) => u.username.toLowerCase().includes(query))
      );
    } else {
      setSuggestions([]);
    }
  }, [currentTag]);

  const handleInputChange = (
    content: string,
    delta: any,
    source: any,
    editor: any
  ) => {
    setValue(content);

    const selection = editor.getSelection();
    if (!selection) return;

    const cursorPosition = selection.index;
    const text = content.slice(0, cursorPosition);
    const lastWord = text.split(/\s+/).pop();

    if (lastWord?.startsWith("@")) {
      setCurrentTag(lastWord.slice(1)); // Exclude '@'
      setTagging(true);
    } else {
      setTagging(false);
      setSuggestions([]);
    }
  };

  const handleTagClick = (username: string) => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    if (!selection) return;

    const cursorPosition = selection.index;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);

    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      quill.deleteText(lastAtIndex, cursorPosition - lastAtIndex);
      quill.insertText(lastAtIndex, username, "link", "#");
      quill.insertText(lastAtIndex + username.length, " ");

      setValue(quill.root.innerHTML);
      setTagging(false);
      setSuggestions([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handlePostComment = async () => {
    if (value.trim() === "" || value.length > 250) {
      setError("Comment must be between 1 and 250 characters.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const storage = getStorage();
        const storageRef = ref(storage, `comments/${user.uid}/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Upload error: ", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                imageUrl = downloadURL;
                resolve(downloadURL);
              });
            }
          );
        });
      }

      await addDoc(collection(db, "comments"), {
        text: value,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        imageUrl, // Save the image URL in Firestore
        createdAt: Timestamp.now(),
        reactions: { like: 0, love: 0, laugh: 0 },
        tags: extractTags(value),
      });

      setValue("");
      setImage(null); // Clear the selected file
      setLoading(false);
    } catch (error) {
      console.error("Error posting comment: ", error);
      setError("Failed to post comment. Please try again.");
      setLoading(false);
    }
  };

  const extractTags = (content: any) => {
    const regex = /@(\w+)/g;
    let matches;
    const tags = [];
    while ((matches = regex.exec(content)) !== null) {
      tags.push(matches[1]);
    }
    return tags;
  };

  useEffect(() => {
    // Register custom blot only on the client side
    if (typeof window !== "undefined") {
      const Quill = require("quill");
      const Inline = Quill.import("blots/inline");

      class TagBlot extends Inline {
        static create(value: any) {
          let node = super.create();
          node.setAttribute("class", "tag");
          node.setAttribute("data-username", value);
          return node;
        }

        static formats(node: any) {
          return node.getAttribute("data-username");
        }

        format(name: any, value: any) {
          if (name === "tag" && value) {
            this.domNode.setAttribute("data-username", value);
            this.domNode.setAttribute("class", "tag");
          } else {
            super.format(name, value);
          }
        }
      }

      TagBlot.blotName = "tag";
      TagBlot.className = "tag";
      TagBlot.tagName = "SPAN";

      Quill.register(TagBlot);
    }
  }, []);

  return (
    <div className="border border-gray-300 rounded-2xl p-6 flex flex-col relative">
      <ReactQuill
        value={value}
        onChange={(content, delta, source, editor) =>
          handleInputChange(content, delta, source, editor)
        }
        modules={modules}
        placeholder="Write a comment..."
        className="custom-quill border-b border-gray-800 outline-none"
        ref={(el: any) => {
          // Ensure that the ref is being correctly assigned
          if (el) {
            quillRef.current = el.getEditor(); // Get the editor instance directly
          }
        }}
      />
      <input type="file" onChange={handleFileChange} className="mt-4" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {tagging && suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((suggestion: any) => (
            <li
              key={suggestion.id}
              onClick={() => handleTagClick(suggestion.username)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              @{suggestion.username}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between mt-2">
        <button
          onClick={handlePostComment}
          className="px-4 py-1 text-sm bg-gray-900 text-white rounded-lg w-fit mt-1 self-end"
          disabled={loading}
        >
          {loading ? <CircularProgress size={16} /> : "Send"}
        </button>
      </div>
    </div>
  );
};
export default CommentInputBox;
