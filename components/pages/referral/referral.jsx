import React, { useState } from "react";
import Layout from "../../ui/layout";
import { FaHandshakeSimple } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import { emailValidationRule } from "../../../utils/validate-common";
import {
  optionalPhoneValidationRule,
  requiredPhoneValidationRule,
  textMinLength3Rule,
} from "../../../utils/validate-common";

export default function Referral() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      altphone: "",
      experience: "",
      resume: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("altphone", data.altphone);
      formData.append("experience", data.experience);
      if (data.resume?.[0]) {
        formData.append("document", data.resume[0]);
      }

      await axios.post("/api/referral", formData);
      toast.success("Referral submitted successfully!");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit referral");
      console.log(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className=" px-6 space-y-5">
        <div className="bg-[#5f4d76] rounded-lg px-6 py-4">
          <div className="flex items-center gap-3">
            <FaHandshakeSimple className="text-white" size={30} />
            <div className="">
              <h1 className="text-2xl text-white font-semibold">
                Refer a Candidate
              </h1>
              <p className="text-zinc-200 text-sm">
                Help us hire great people and build a strong team!
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-3">
          <div className="col-span-2 bg-white rounded-lg overflow-hidden ">
            <div className=" p-4 border-b border-zinc-300 bg-zinc-100/40">
              <h2 className="text-lg font-semibold text-gray-700">
                Candidate Information
              </h2>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="relative"
            >
              {isSubmitting && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-md bg-white/60 backdrop-blur-[1px]">
                  <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-4 py-2 shadow-sm">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
                    <span className="text-sm font-medium text-zinc-700">
                      Submitting referral...
                    </span>
                  </div>
                </div>
              )}
              <fieldset disabled={isSubmitting} className="contents">
                <div className="p-4 grid gap-x-3 gap-y-4 grid-cols-2">
                  <div className="col-span-1">
                    <label className="label" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      {...register("name", textMinLength3Rule("Name"))}
                      type="text"
                      id="name"
                      placeholder="Full Name"
                      className="input"
                    />
                    {errors.name && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="label" htmlFor="email">
                      Email
                    </label>
                    <input
                      {...register("email", emailValidationRule)}
                      type="email"
                      id="email"
                      placeholder="Email Address"
                      className="input"
                    />
                    {errors.email && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="label" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      {...register("phone", requiredPhoneValidationRule)}
                      type="tel"
                      id="phone"
                      placeholder="10-digit Phone Number"
                      className="input"
                    />
                    {errors.phone && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="label" htmlFor="altphone">
                      Alternate Phone
                    </label>
                    <input
                      {...register("altphone", optionalPhoneValidationRule)}
                      type="tel"
                      id="altphone"
                      placeholder="Alternate Phone Number (Optional)"
                      className="input"
                    />
                    {errors.altphone && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors.altphone.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="label" htmlFor="experience">
                      Years of Experience
                    </label>
                    <input
                      {...register("experience", {
                        required: "Experience is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Enter a valid number",
                        },
                      })}
                      type="text"
                      id="experience"
                      placeholder="e.g., 5 or 5.5"
                      className="input"
                    />
                    {errors.experience && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="label" htmlFor="resume">
                      Resume (.pdf,.doc,.docx)
                    </label>
                    <input
                      {...register("resume", {
                        required: "Resume is required",
                        validate: (files) => {
                          if (!files?.[0]) return true;
                          const maxSize = 2 * 1024 * 1024; // 2 MB
                          return (
                            files[0].size <= maxSize ||
                            "File size must be less than 2 MB"
                          );
                        },
                      })}
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      className="input"
                    />
                    {errors.resume && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors.resume.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-2 border-t border-zinc-300 p-4 gap-3 mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="button cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button2 w-fit"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Referral"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="col-span-1">
            <div className="bg-gray-50 overflow-hidden rounded-lg">
              <h3 className="text-lg border-b p-4 bg-zinc-100/40 border-zinc-300 font-semibold text-gray-700 mb-4 flex items-center gap-2">
                Referral Tips
              </h3>
              <div className="p-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl -mt-2">•</span> Share why the
                    candidate is a strong fit for the role.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl -mt-2">•</span> Verify the
                    candidate's full name, email, and current mobile number for
                    accuracy.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl -mt-2">•</span> Submit a tailored,
                    up-to-date resume that highlights relevant skills.
                  </li>
                </ul>
                <div className="mt-4 bg-cyan-100 border border-cyan-300 rounded-lg p-4 text-cyan-800 text-sm flex gap-2">
                  <span>
                    Refer a qualified candidate and make a direct impact on our
                    company's success.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
