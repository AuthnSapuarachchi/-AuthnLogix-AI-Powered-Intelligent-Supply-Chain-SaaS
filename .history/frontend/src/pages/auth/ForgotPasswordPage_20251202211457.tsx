import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../features/auth/api/authApi";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit } = useForm<{ email: string }>();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data.email),
    onSuccess: () => {
      setIsSent(true);
      toast.success("Reset link sent!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to send link")
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl">
        
        {isSent ? (
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-green-500/10 rounded-full text-green-500">
              <Mail size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Check your Inbox</h2>
            <p className="text-gray-400">
              We sent a password reset link to your email. Please click it to continue.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
              Return to Login
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-400 mb-6">Enter your email and we'll send you a recovery link.</p>
            
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="admin@authnlogix.com"
                {...register("email", { required: true })}
              />
              <Button type="submit" className="w-full" isLoading={isPending}>
                Send Reset Link
              </Button>
            </form>

            <button 
              onClick={() => navigate("/")} 
              className="mt-6 flex items-center justify-center text-sm text-gray-500 hover:text-white w-full gap-2"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};