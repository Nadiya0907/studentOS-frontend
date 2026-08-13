import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (data) => {
    setLoading(true);

    try {
      await signup({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        role: "student",
          roll_number: data.roll_number,
      });

      toast.success("Account created — please log in");
      navigate("/login");
    }   catch (error) {
  const detail = error.response?.data?.detail;

  const message = Array.isArray(detail)
    ? detail.map((item) => item.msg).join(", ")
    : typeof detail === "string"
      ? detail
      : error.response?.data?.message || "Signup failed";

  toast.error(message);
}finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-black text-white">
        Create account
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Start your StudentOS journey.
      </p>

      <form
        onSubmit={handleSubmit(submit)}
        className="mt-7 space-y-4"
      >
        <Input
          label="Full name"
          placeholder="Your name"
          error={errors.full_name?.message}
          {...register("full_name", {
            required: "Full name is required",
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@college.edu"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
        />
        <Input
  label="Roll Number"
  placeholder="e.g. CS-101"
  error={errors.roll_number?.message}
  {...register("roll_number", {
    required: "Roll number is required",
  })}
/>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-accent-soft"
        >
          Log in
        </Link>
      </p>
    </Card>
  );
}