import { ICONS } from "@/assets";
import { useAuth } from "@/context/AuthContext";

const Authentication = () => {
  const { signIn, user, logout }: any = useAuth();

  return (
    <>
      {!user ? (
        <button
          onClick={signIn}
          className="flex items-center gap-1 text-gray-800 text-2xl"
        >
          <ICONS.Google />
          <span className="text-sm">Sign in with Google</span>
        </button>
      ) : (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <img
              src={user?.reloadUserInfo?.photoUrl}
              alt="image"
              className="rounded-full h-8 w-8"
            />
            <p className="text-gray-600 font-medium text-md">
              {user?.displayName}
            </p>
          </div>
          <button onClick={logout} className="text-gray-600 font-medium">
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Authentication;
