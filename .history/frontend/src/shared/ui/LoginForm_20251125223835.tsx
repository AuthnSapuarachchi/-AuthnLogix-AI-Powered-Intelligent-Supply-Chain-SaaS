import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser, LoginPayload } from "../../features/auth/api/authApi";
import { Button } from "../";
import { Input } from "../../../shared/ui/Input";

// 1. Define the Validation Schema (Rules)
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Infer TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 2. Initialize the Form Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Handle Submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setApiError(null);
    try {
      console.log("Attempting login with:", data.email);
      const response = await loginUser(data);

      // SUCCESS!
      console.log("Login Successful! Token:", response.token);
      alert("Login Successful! Check Console for Token.");

      // TODO: In the next ticket, we will save this token to Zustand store
    } catch (error: any) {
      setApiError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 space-y-6 bg-gray-900 border border-gray-800 rounded-xl shadow-xl">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-400">
          Enter your credentials to access the system
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          placeholder="name@example.com"
          type="email"
          error={errors.email?.message}
          {...register("email")} // Connect input to React Hook Form
        />

        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />

        {apiError && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
            {apiError}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>
    </div>
  );
};
