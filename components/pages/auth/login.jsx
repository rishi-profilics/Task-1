import axios from "../../../utils/axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PiFinnTheHumanFill } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const res = await axios.post("/login", data);
      if (res) {
        localStorage.removeItem("token")
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center h-screen  relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-zinc-100 space-y-2 rounded-lg  ml-52 w-80 z-10 p-8"
      >
        <div className="flex items-center justify-center mb-8 text-purple-950">
          <PiFinnTheHumanFill size={36} />
        </div>
        <h2 className="mb-4">LOGIN TO YOUR ACCOUNT</h2>

        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter valid email",
            },
          })}
          type="text"
          className="input"
          placeholder="Email Address"
        />
        {errors.email && (
          <p className="text-red-600 text-xs">{errors.email.message}</p>
        )}

        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be more then 8 characters",
            },
          })}
          type="password"
          className="input"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-600 text-xs">{errors.password.message}</p>
        )}

        <button
          className="bg-purple-950 p-2 w-full text-white rounded-md mt-5"
          disabled={loading}
          type="submit"
        >
          {loading ? "Loading..." : "Login" }
        </button>

        {serverError && <p className="text-red-600 text-xs">{serverError}</p>}

        <div className="flex justify-center items-center gap-1">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-700">
            {" "}
            Register
          </Link>{" "}
        </div>
      </form>
      <div className="bg-purple-950 h-screen z-0 top-0 left-0 absolute w-1/4"></div>
      <div className=" h-screen absolute right-0 z-0 w-3/4">
        <div className="h-full w-full flex items-center justify-center">
          <img className="w-1/2 object-cover" src="" alt="" />
        </div>
      </div>
    </div>
  );
}
