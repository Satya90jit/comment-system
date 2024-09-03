import { ICONS } from "@/assets";
import { useAuth } from "@/context/AuthContext";

const SignInButton = () => {
  const { signIn }: any = useAuth();

  return (
    <button
      onClick={signIn}
      className="flex items-center gap-1 text-gray-800 text-2xl"
    >
      <ICONS.Google />
      <span className="text-sm">Sign in with Google</span>
    </button>
  );
};

export default SignInButton;
