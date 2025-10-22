"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  BarChart3,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import SignCard from "@/components/sign/card";
import { toast } from "sonner";

// SignupForm Component
interface SignupFormProps {
  onSignupSuccess: (email: string, nickname: string, password: string) => void;
  locale: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess, locale }) => {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return t("sign_up.validation.password_too_short");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return t("sign_up.validation.password_no_lowercase");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return t("sign_up.validation.password_no_uppercase");
    }
    if (!/(?=.*\d)/.test(password)) {
      return t("sign_up.validation.password_no_number");
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError(t("sign_up.please_agree_terms"));
      return;
    }

    // Validate passwords
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("sign_up.validation.passwords_not_match"));
      return;
    }

    setIsLoading(true);

    try {
      // 发送验证码
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          nickname: formData.nickname,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      // 验证码发送成功，进入验证步骤
      onSignupSuccess(formData.email, formData.nickname, formData.password);
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: redirect || "/dashboard" });
  };

  return (
    <>
      {/* Signup Form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("sign_up.fullname_title")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                value={formData.nickname}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder={t("sign_up.fullname_placeholder")}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("sign_up.email_title")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder={t("sign_up.email_placeholder")}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("sign_up.password_title")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder={t("sign_up.password_placeholder")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("sign_up.confirm_password_title")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder={t("sign_up.confirm_password_placeholder")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {t("sign_up.password_requirements_title")}
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              {t("sign_up.requirements.min_length")}
            </li>
            <li className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${/(?=.*[a-z])/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              {t("sign_up.requirements.lowercase")}
            </li>
            <li className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${/(?=.*[A-Z])/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              {t("sign_up.requirements.uppercase")}
            </li>
            <li className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${/(?=.*\d)/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              {t("sign_up.requirements.number")}
            </li>
          </ul>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600">
              {t("sign_up.terms_agreement")}{" "}
              <a
                href="/terms-of-service"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {t("sign_up.terms_of_service")}
              </a>{" "}
              {t("sign_up.and")}{" "}
              <a
                href="/privacy-policy"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {t("sign_up.privacy_policy")}
              </a>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={
              isLoading ||
              !agreedToTerms ||
              !formData.password ||
              !formData.confirmPassword ||
              validatePassword(formData.password) !== "" ||
              formData.password !== formData.confirmPassword
            }
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("sign_up.creating_account")}
              </div>
            ) : (
              <div className="flex items-center">
                {t("sign_up.create_account")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </div>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t("sign_up.already_have_account")}{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {t("sign_up.sign_in_link")}
            </Link>
          </p>
        </div>
      </form>

      {/* Social Signup */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              {t("sign_up.or_sign_up_with")}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                {t("sign_up.signing_in_with_google")}
              </div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">{t("sign_up.google")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

// Email Verification Component
interface EmailVerificationProps {
  email: string;
  nickname: string;
  password: string;
  onVerificationSuccess: () => void;
  locale: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  nickname,
  password,
  onVerificationSuccess,
  locale,
}) => {
  const t = useTranslations();
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    // 处理粘贴完整验证码的情况
    if (value.length > 1) {
      // 如果粘贴的内容是6位数字，直接填充所有输入框
      if (value.length === 6 && /^\d{6}$/.test(value)) {
        const newCode = value.split("");
        setVerificationCode(newCode);
        setError("");

        // 自动验证
        handleVerify(value);
        return;
      }
      // 如果粘贴的内容不是6位数字，只取第一个字符
      value = value.charAt(0);
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all fields are filled
    if (
      newCode.every((digit) => digit !== "") &&
      newCode.join("").length === 6
    ) {
      handleVerify(newCode.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // 只处理6位数字的粘贴
    if (pastedData.length === 6 && /^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setVerificationCode(newCode);
      setError("");

      // 自动验证
      handleVerify(pastedData);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const codeToVerify = code || verificationCode.join("");
    if (codeToVerify.length !== 6) {
      setError(t("sign_up.verification.complete_code"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: codeToVerify,
          nickname,
          password,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify code");
      }

      // 验证成功
      onVerificationSuccess();
    } catch (error) {
      console.error("Verification error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to verify code",
      );
      setVerificationCode(["", "", "", "", "", ""]);
      const firstInput = document.getElementById("code-0");
      firstInput?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          nickname,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      // 设置重发冷却时间
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to resend code",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>
        <p className="text-gray-600 mb-6">{t("sign_up.verification.title")}</p>
      </div>

      {/* Verification Code Input */}
      <div className="flex justify-center space-x-3 mb-6">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
            autoComplete="off"
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-800 text-center">{error}</p>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={isLoading || verificationCode.some((digit) => digit === "")}
        className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {t("sign_up.verification.verifying")}
          </div>
        ) : (
          t("sign_up.verification.verify_email")
        )}
      </button>

      {/* Resend Code */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-2">
          {t("sign_up.verification.didnt_receive_code")}
        </p>
        <button
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || isResending}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {isResending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600 mr-2"></div>
              {t("sign_up.verification.resending")}
            </div>
          ) : resendCooldown > 0 ? (
            t("sign_up.verification.resend_in", { seconds: resendCooldown })
          ) : (
            t("sign_up.verification.resend_code")
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {t("sign_up.verification.check_spam")}
        </p>
      </div>
    </div>
  );
};

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const t = useTranslations();
  const locale = (params.locale as string) || "en";

  const [currentStep, setCurrentStep] = useState<"signup" | "verification">(
    "signup",
  );
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState({
    nickname: "",
    password: "",
  });

  // 检查登录状态，如果已登录则重定向
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl || "/dashboard");
    }
  }, [session, status, router, callbackUrl]);

  // 如果正在检查会话状态，显示加载状态
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span className="text-gray-600">{t("loading")}</span>
        </div>
      </div>
    );
  }

  // 如果已登录，不渲染页面内容（会被重定向）
  if (status === "authenticated") {
    return null;
  }

  const handleSignupSuccess = (
    email: string,
    nickname: string,
    password: string,
  ) => {
    setUserEmail(email);
    setUserData({ nickname, password });
    setCurrentStep("verification");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Left Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 mb-8 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {t("metadata.name")}
              </span>
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t("sign_up.title")}
            </h2>
            <p className="text-gray-600">{t("sign_up.description")}</p>
          </div>

          {currentStep === "signup" && (
            <SignupForm onSignupSuccess={handleSignupSuccess} locale={locale} />
          )}

          {currentStep === "verification" && (
            <EmailVerification
              email={userEmail}
              nickname={userData.nickname}
              password={userData.password}
              onVerificationSuccess={() => {
                // Redirect to dashboard after successful verification
                window.location.href = "/dashboard";
              }}
              locale={locale}
            />
          )}
        </div>
      </div>

      {/* Right Side - Benefits Showcase */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Background Elements */}
        <SignCard />
      </div>
    </div>
  );
}
