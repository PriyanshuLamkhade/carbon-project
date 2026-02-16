import { SignUpForm } from "@/features/auth/SignUpForm";


export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-800 text-white">
      <SignUpForm/>
    </div>
  );
}
