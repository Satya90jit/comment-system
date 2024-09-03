import { CircularProgress } from "@mui/material";
import { useState } from "react";

const ReplyForm = ({ commentId, onPostReply, onCancel }: any) => {
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReplySubmit = async () => {
    if (replyText.trim()) {
      setLoading(true);
      await onPostReply(commentId, replyText);
      setLoading(false);
      setReplyText("");
    }
  };

  return (
    <div className="mt-4">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        rows={3}
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="Write a reply..."
      />
      <div className="flex justify-end mt-2 gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-1 text-sm bg-gray-300 text-white rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleReplySubmit}
          className="px-4 py-1 text-sm bg-blue-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? <CircularProgress size={14} color="inherit" /> : "Reply"}
        </button>
      </div>
    </div>
  );
};

export default ReplyForm;
