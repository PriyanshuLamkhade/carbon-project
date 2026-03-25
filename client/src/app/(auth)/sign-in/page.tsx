import Login from "@/features/auth/Login";
import SignInForm from "@/features/auth/SignInForm";

const Page = () => {
  return (
    <div className="h-screen w-full items-center flex flex-col text-white justify-center bg-gray-800">
      <Login/>
    </div>
  );
};

export default Page;
