import { CommentInputBox } from "@/components/cards";
import CommentsList from "@/components/comment/CommentList";
import SignInButton from "@/components/core/SignInButton";
import SignOutButton from "@/components/core/SignOutButton";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user }: any = useAuth();
  return (
    <section className="mx-auto px-60 my-14">
      <div className="mb-2 px-2">
        {!user ? <SignInButton /> : <SignOutButton />}
      </div>
      <div className="border-2 border-gray-300 rounded-lg p-8 space-y-6">
        <div className="flex justify-between">
          <h1 className="text-gray-800 text-xl font-medium">Comments(3)</h1>
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
