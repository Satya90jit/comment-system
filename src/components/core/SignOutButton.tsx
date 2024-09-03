import { useAuth } from "@/context/AuthContext";

const SignOutButton = () => {
  const { logout }: any = useAuth();
  const { user }: any = useAuth();

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <img
          src={user?.reloadUserInfo?.photoUrl}
          alt="image"
          className="rounded-full h-8 w-8"
        />
        <p className="text-gray-600 font-medium text-md">{user?.displayName}</p>
      </div>
      <button onClick={logout} className="text-gray-600 font-medium">
        Logout
      </button>
    </div>
  );
};

export default SignOutButton;
