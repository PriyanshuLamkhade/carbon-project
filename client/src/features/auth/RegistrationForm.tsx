import { authService } from "@/app/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ValidatorDetails from "./ValidatorDetails";

type Role = "USER" | "VALIDATOR" | "";

interface FormData {
  phone: string;
  organisation: string;
  role: Role;
}
type ValidatorDataType = {
  phone: string;
  organisation: string;
  role: "VALIDATOR";
  userData: any;
};


const isValidPhone = (val: string): boolean => /^\d{10}$/.test(val);

const formatPhoneDisplay = (digits: string): string => {
  const d = digits.replace(/^\+/, "");
  if (d.length <= 5) return d;
  if (d.length <= 10) return `${d.slice(0, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 7)} ${d.slice(7)}`;
};

export default function RegistrationForm({ userData }: any) {
  const [rawPhone, setRawPhone] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    organisation: "",
    role: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [validatorData, setValidatorData] = useState<ValidatorDataType>()
  const [isvalidator, setIsValidator] = useState(false)
  const router = useRouter()
  const phoneValid = isValidPhone(rawPhone);
  const orgValid = formData.organisation.trim().length > 0;
  const roleValid = formData.role !== "";
  const allValid = phoneValid && orgValid && roleValid;
  const completedCount = [phoneValid, orgValid, roleValid].filter(
    Boolean,
  ).length;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value
      .replace(/[^\d+]/g, "")
      .replace(/(?!^)\+/g, "");
    setRawPhone(cleaned);
    setFormData((prev) => ({
      ...prev,
      phone: isValidPhone(cleaned) ? cleaned : "",
    }));
  };

  async function handleSubmit() {
    try {
      if(formData.role === "VALIDATOR"){
        const validatorDetail = {
        phone: `+91${formData.phone}`,
        organisation: formData.organisation,
        role: formData.role,
        userData
      };

      setValidatorData(validatorDetail);
        setIsValidator(true)
        
      }
      else if (allValid) {
      const result = await axios.post(`${authService}/users/registerUser`, {
        phone: `+91${formData.phone}`,
        organisation: formData.organisation,
        role: formData.role,
        userData //name, email profile pic
      },{withCredentials: true,});
      setSubmitted(true);
      toast.success(result.data.message)
      if( result.data.role === "USER"){
        router.push("/user/dashboard")
      }else if( result.data.role === "VALIDATOR"){
        router.push("/validator/dashboard")
      }
    }
    } catch (error) {
      console.log(error)
    }
    
  }

  if(isvalidator){
    return <ValidatorDetails validatorData={validatorData}/>
  }


  const handleReset = () => {
    setRawPhone("");
    setFormData({ phone: "", organisation: "", role: "" });
    setSubmitted(false);
    setFocused(null);
  };

  const phoneDisplayValue =
    focused === "phone" || !phoneValid
      ? rawPhone
      : formatPhoneDisplay(rawPhone);

   
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white  rounded-2xl  overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 px-8 py-7">
          <p className="text-green-100 text-xs font-semibold tracking-widest uppercase mb-1">
            New Account
          </p>
          <h1 className="text-white text-2xl font-bold">Create Profile</h1>
          <p className="text-green-100 text-sm mt-1">
            All fields are required to proceed
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-8 pt-5 pb-1">
          <div className="flex gap-1.5">
            {[phoneValid, orgValid, roleValid].map((done, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${done ? "bg-green-500" : "bg-gray-200"}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {completedCount} of 3 completed
          </p>
        </div>

        {/* Fields */}
        <div className="px-8 py-5 space-y-5">
          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              Phone Number
              {phoneValid && (
                <svg
                  className="w-3.5 h-3.5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
            <div
              className={`flex items-center rounded-xl border-2 transition-colors duration-200 overflow-hidden ${
                focused === "phone"
                  ? "border-green-400"
                  : phoneValid
                    ? "border-green-300"
                    : rawPhone.length > 0
                      ? "border-red-300"
                      : "border-gray-200"
              }`}
            >
              <span className="pl-4 pr-1 text-gray-400 text-sm font-medium select-none">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={phoneDisplayValue}
                onChange={handlePhoneChange}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                placeholder="98765 43210"
                maxLength={10}
                className="flex-1 pr-4 py-3.5 text-gray-800 text-sm bg-transparent outline-none placeholder-gray-300"
              />
              {phoneValid && (
                <span className="pr-3 text-green-500">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
            {rawPhone.length > 0 && !phoneValid && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Enter a valid 10-digit mobile number
              </p>
            )}
            {phoneValid && (
              <p className="text-xs text-gray-400">
                Stored as{" "}
                <span className="font-mono font-semibold text-gray-600">
                  {formData.phone}
                </span>
              </p>
            )}
          </div>

          {/* Organisation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              Organisation Name
              {orgValid && (
                <svg
                  className="w-3.5 h-3.5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
            <input
              type="text"
              value={formData.organisation}
              onChange={(e) =>
                setFormData({ ...formData, organisation: e.target.value })
              }
              onFocus={() => setFocused("org")}
              onBlur={() => setFocused(null)}
              placeholder="Acme Corporation"
              className={`w-full px-4 py-3.5 rounded-xl border-2 text-gray-800 text-sm outline-none placeholder-gray-300 transition-colors duration-200 ${
                focused === "org"
                  ? "border-green-400"
                  : orgValid
                    ? "border-green-300"
                    : "border-gray-200"
              }`}
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              Role
              {roleValid && (
                <svg
                  className="w-3.5 h-3.5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["USER", "VALIDATOR"] as const).map((role) => {
                const active = formData.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 flex items-center justify-center gap-2 ${
                      active
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {role === "USER" ? (
                      <svg
                        className={`w-4 h-4 ${active ? "text-green-500" : "text-gray-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className={`w-4 h-4 ${active ? "text-green-500" : "text-gray-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    )}
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!allValid}
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
              allValid
                ? "bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {allValid ? (
              <>
                Continue
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Fill all fields to continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
