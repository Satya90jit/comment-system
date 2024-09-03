import { useState } from "react";

interface ReplyFormProps {
  commentId: string;
  onPostReply: (commentId: string, replyText: string) => void;
  onCancel: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  commentId,
  onPostReply,
  onCancel,
}) => {
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async () => {
    if (replyText.trim()) {
      await onPostReply(commentId, replyText);
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
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default ReplyForm;
