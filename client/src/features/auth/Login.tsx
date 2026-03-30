"use client";
import axios from "axios";
import { useState } from "react";

import { toast } from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

import { authService } from "@/app/page";
import { useAppData } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import RegistrationForm from "./RegistrationForm";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setIsAuth } = useAppData();
  const [onboard, setOnboard] = useState(false);
  const [tempUser, setTempUser] = useState();
  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${authService}/users/login`,
        {
          code: authResult["code"],
        },
        { withCredentials: true },
      );
      

      setIsAuth(true);
      toast.success(result.data.message);
      setLoading(false);
      setUser(result.data.user);
      setIsAuth(true);

      if (!result.data.newUser && result.data.role === "USER") {
        router.push("/user/dashboard");
      } else if (!result.data.newUser && result.data.role === "VALIDATOR") {
        router.push("/validator/dashboard");
      } else {
        console.log("new user")
        setOnboard(result.data.newUser);
        setTempUser(result.data.tempUserData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Problem while login");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  if (onboard) {
    return <RegistrationForm userData={tempUser} />;
  }
  return (
    <div className="flex min-h-screen min-w-full  items-center justify-center px-4">
      <div className="w-full space-y-6  items-center ">
        <h1 className="text-center text-3xl font-bold text-[#37e251]">
          LayerZero
        </h1>
        <p className="text-center text-sm text-gray-500">
          Login or signup to continue
        </p>
        <button
          onClick={googleLogin}
          disabled={loading}
          className="flex w-md items-center justify-center gap-3 rounded-xl border mx-auto 
            border-gray-300 bg-white px-4 py-3 cursor-pointer text-black
            hover:-translate-0.5"
        >
          <FcGoogle size={20} />
          {loading ? "Signin in ..." : "Continue with Google"}
        </button>

        <p className="text-center text-xs text-gray-400">
          By contining, you agree with our{" "}
          <span className=" text-[#37e251]">Terms of Service</span> &{" "}
          <span className=" text-[#37e251]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
