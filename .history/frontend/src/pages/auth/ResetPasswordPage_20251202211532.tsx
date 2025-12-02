import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../features/auth/api/authApi";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => resetPassword(token!, data.password),
    onSuccess: () => {
      toast.success("Password Updated! Please login.");
      navigate("/");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to reset")
  });

  // Validate Passwords match
  const password = watch("password");

  if (!token) return <div className="text-white text-center p-10">Invalid Link</div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
            <Lock className="w-10 h-10 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Set New Password</h1>
            <p className="text-gray-400 text-sm">Your new password must be different from previously used passwords.</p>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
          <Input 
            label="New Password" 
            type="password" 
            {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
            error={errors.password?.message as string}
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            {...register("confirm", { 
                required: "Required", 
                validate: (val) => val === password || "Passwords do not match" 
            })}
            error={errors.confirm?.message as string}
          />
          <Button type="submit" className="w-full" isLoading={isPending}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};