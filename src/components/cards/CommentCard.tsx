import {
  AddReaction,
  AddReactionOutlined,
  SentimentVerySatisfied,
  ThumbUp,
} from "@mui/icons-material";
import React from "react";

const CommentCard = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <img
          src="/profile2.jpg"
          className="rounded-full h-8 w-8 border object-center object-cover shadow-md"
        />
        <p className="text-gray-700">John nash</p>
      </div>
      <p className="text-gray-600 text-md">
        Words,written or spoken, are the main form of communication for most
        people. When commenting on an Instagram reel, be as creative as
        possible.
      </p>
      <img
        src="/profile1.jpeg"
        className="h-20 w-20 rounded-xl object-center object-cover"
      />
      {/* Emoji and reply and count and time likes part  */}
      <div className="flex items-center gap-2 text-gray-500">
        <AddReactionOutlined className="text-gray-500" />
        <div className="flex justify-center items-center">
          <span className="rounded-2xl px-2 border border-gray-300">
            <ThumbUp className="text-yellow-400 !text-sm" />
          </span>
          <span className="rounded-2xl px-2 border border-gray-300">
            <SentimentVerySatisfied className="text-yellow-400 !text-sm" />
          </span>
        </div>
        <span className="text-sm inline-block border-l pl-2 h-4 border-gray-300">
          Reply
        </span>
        <span className="text-sm inline-block border-l pl-2 h-4 border-gray-300">
          2 min
        </span>
      </div>
      <hr />
    </div>
  );
};

export default CommentCard;
