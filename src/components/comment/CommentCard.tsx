import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ReplyForm from "../reply/ReplyForm";
import { Comment } from "@/types/comment";

interface CommentCardProps {
  comment: Comment;
  onPostReply: (
    commentId: string,
    replyText: string,
    parentReplyId: any
  ) => void;
  depth?: number; // Add depth prop to track the level of the reply
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onPostReply,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const timeAgo = formatDistanceToNow(comment.createdAt.toDate(), {
    addSuffix: true,
  });

  const handleReply = async (replyText: string, parentReplyId?: string) => {
    await onPostReply(comment.id, replyText, parentReplyId);
    setShowReplyForm(false);
  };

  return (
    <div className="space-y-3 p-4 bg-white shadow-md rounded-lg relative">
      <div className="flex items-center gap-2">
        <img
          src={comment.userPhoto || "/default-avatar.png"}
          alt={comment.userName || "Anonymous"}
          className="rounded-full h-8 w-8 border object-center object-cover shadow-md"
        />
        <p className="text-gray-700">{comment.userName || "Anonymous"}</p>
      </div>
      <p
        className="text-gray-600 text-md"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      ></p>
      {comment.imageUrl && (
        <img
          src={comment.imageUrl}
          alt="Attachment"
          className="h-20 w-20 rounded-xl object-center object-cover"
        />
      )}
      <div className="flex items-center gap-2 text-gray-500">
        {/* Hide the Reply button if it's the last level (depth = 2) */}
        {depth < 2 && (
          <button
            onClick={() => setShowReplyForm((prev) => !prev)}
            className="text-blue-500 text-sm"
          >
            Reply
          </button>
        )}
        <span className="text-sm inline-block border-l pl-2 h-4 border-gray-300">
          {timeAgo}
        </span>
      </div>

      {showReplyForm && (
        <ReplyForm
          commentId={comment.id}
          onPostReply={(replyText: any) => handleReply(replyText, comment.id)}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="mt-2 text-blue-500 text-sm"
          >
            {showReplies ? "Hide Replies" : "Show Replies"}
          </button>

          {showReplies && (
            <div className="ml-6 mt-3 space-y-3 border-l border-gray-300 pl-3">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onPostReply={onPostReply}
                  depth={depth + 1} // Increase depth for each nested reply
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
