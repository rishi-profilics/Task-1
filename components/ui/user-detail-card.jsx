import axios from "../../utils/axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import { IoIosClose } from "react-icons/io";
import { IoCamera } from "react-icons/io5";
import { toast } from "react-toastify";

export default function UserDetailCard() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    aboutme: "",
    image: null,
  });
  const [openImageDialogue, setOpenImageDialogue] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchProfile = async () => {
    const user = await axios.get("/profile");
    const userData = user.data.data;
    setProfileData((prev) => ({
      ...prev,
      firstName: userData.firstName,
      lastName: userData.lastName,
      aboutme: userData.aboutme,
    }));
  };

  const fetchGalleryImage = async () => {
    const images = await axios.get("/api/gallery");
    setProfileData((prev) => ({
      ...prev,
      image: images.data.data[0]?.image_url,
    }));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      await axios.post("/api/gallery", formData);
    } catch (error) {
      console.log(error.message);
    }
    fetchGalleryImage();
    reset();
    toast.success("Profile Picture Updated");
    setOpenImageDialogue(false);
  };

  useEffect(() => {
    fetchProfile();
    fetchGalleryImage();
  }, []);

  return (
    <div className="bg-zinc-100 w-full flex flex-col justify-center gap-3 py-10 items-center rounded-lg ">
      <div className="h-26 relative w-26 rounded-full p-0.5 shadow-md">
        <div className="absolute  h-8 w-8  bottom-0 shadow-md rounded-full p-0.5 bg-zinc-100 right-0">
          <div
            onClick={() => setOpenImageDialogue(true)}
            className="h-full cursor-pointer w-full flex items-center justify-center rounded-full"
          >
            <IoCamera size={20} />
          </div>
          <div
            className={`fixed inset-0 z-20 ${
              !openImageDialogue && "hidden"
            } bg-black/30 flex items-center mb-0 justify-center p-3`}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className=" w-130 bg-zinc-100 rounded-lg p-4 flex flex-col"
            >
              <div className="border-b border-zinc-100 flex items-center  justify-between">
                <h1 className="text-xl text-zinc-800 font-medium">
                  Change Profile
                </h1>
                <button
                  onClick={() => setOpenImageDialogue(false)}
                  type="button"
                  className="text-3xl cursor-pointer"
                >
                  <IoIosClose />
                </button>
              </div>
              <div className="py-10 ">
                <input
                  {...register("image", {
                    required: "Image is required",
                    validate: {
                      lessThan1MB: (files) =>
                        files[0]?.size < 1024 * 1024 || "Please Select a image of size below 1MB",
                    },
                  })}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="input"
                />
                {errors.image && (
                  <p className="text-xs mt-2 text-red-500">{errors.image.message}</p>
                )}
                {/* <label
                  htmlFor="file-upload"
                  className="cursor-pointer rounded-lg bg-zinc-200 text-zinc-400 p-10 transition-all"
                >
                  <GoPlus size={30} fontWeight={100} />
                </label> */}
              </div>

              <div className=" flex justify-end gap-4">
                <button
                  onClick={() => setOpenImageDialogue(false)}
                  type="button"
                  className="button"
                >
                  Cancle
                </button>
                <button className="button2">Submit</button>
              </div>
            </form>
          </div>
        </div>
        <div className="h-full w-full rounded-full overflow-hidden">
          <img
            src={profileData?.image}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-3xl">{`${profileData?.firstName} ${profileData?.lastName}`}</h1>
      <p className="text-lg text-zinc-600">{profileData?.aboutme}</p>
    </div>
  );
}
