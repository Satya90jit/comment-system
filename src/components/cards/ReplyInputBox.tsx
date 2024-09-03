import React from "react";

const ReplyInputBox = () => {
  return (
    <div className="border border-gray-300 rounded-2xl p-6 flex flex-col">
      <div className="text-gray-700 text-md flex items-center gap-2">
        <span>HI</span> <Tag title="all" />
      </div>
      <input className="border-b border-gray-700 focus:outline-none" />
      <div className="self-end flex gap-3">
        <button className="px-6 py-1 text-sm bg-gray-300 text-gray-900 rounded-lg w-fit mt-3 border border-gray-700 self-end">
          Cancel
        </button>
        <button className="px-4 py-1 text-sm bg-gray-900 text-white rounded-lg w-fit mt-3">
          Send
        </button>
      </div>
    </div>
  );
};

export default ReplyInputBox;

const Tag = ({ title }: { title: string }) => {
  return (
    <div className="bg-blue-200/40 rounded-2xl px-2 py-1 text-blue-700 text-xs w-fit">
      @{title}
    </div>
  );
};
