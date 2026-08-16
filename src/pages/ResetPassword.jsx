import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { authService } from "../services/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const submit = async (data) => {
    setLoading(true);

    try {
      await authService.resetPassword({
        token,
        password: data.password,
      });

      setDone(true);

      toast.success(
        "Password reset successfully"
      );
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Could not reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-black text-white">
        Set new password
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Create a new password for your StudentOS account.
      </p>

      {done ? (
        <div className="mt-7">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">
            Your password has been reset successfully.
          </div>

          <Link
            to="/login"
            className="mt-5 block text-center text-sm text-accent-soft"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(submit)}
          className="mt-7 space-y-4"
        >
          <Input
            label="New password"
            type="password"
            placeholder="Enter your new password"
            error={errors.password?.message}
            {...register("password", {
              required:
                "Password is required",
              minLength: {
                value: 8,
                message:
                  "Password must be at least 8 characters",
              },
            })}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="Confirm your new password"
            error={errors.confirmPassword?.message}
            {...register(
              "confirmPassword",
              {
                required:
                  "Please confirm your password",
                validate: (value) =>
                  value === password ||
                  "Passwords do not match",
              }
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Resetting..."
              : "Reset password"}
          </Button>
        </form>
      )}
    </Card>
  );
}