import axios from "../../utils/axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GoPlus } from "react-icons/go";
import { IoIosClose } from "react-icons/io";
import { IoCamera } from "react-icons/io5";
import { toast } from "react-toastify";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import ActivityContext from "../../src/context/activity-context";

export default function UserDetailCard({ userDetail }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageDialogue, setOpenImageDialogue] = useState(false);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const { fetchGalleryImage: profileImage, profileData: userData}  = useContext(ActivityContext)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    aboutme: "",
    image: null,
  });
  const [galleryData, setGalleryData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const fetchProfileData = async () => {
    setProfileData((prev) => ({
      ...prev,
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      aboutme: userData?.aboutme || "",
    }));
  };

  const fetchGalleryImage = async () => {
    const images = await axios.get("/api/gallery", {
      params: {
        order: "newest",
      },
    });
    setProfileData((prev) => ({
      ...prev,
      image: images.data.data[0]?.image_url,
    }));

    console.log("Images data", images.data.data.slice(0, 4));
    setGalleryData(images.data.data.slice(0, 3));
  };

  const onSubmit = async () => {
    if (!cropperRef.current) {
      setError("image", { type: "required", message: "Please select image" });
      return;
    } else {
      clearErrors("image");
    }

    const cropper = cropperRef.current.cropper;

    const canvas = cropper.getCroppedCanvas({
      width: 400,
      height: 400,
    });

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg"),
    );

    const file = new File([blob], "profile.jpg", {
      type: "image/jpeg",
    });

    try {
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/api/gallery", formData);
      profileImage()
      fetchGalleryImage();
      toast.success("Profile picture has been updated successfully");

      resetCropState();
      setOpenImageDialogue(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const resetCropState = () => {
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchGalleryImage();
  }, [userDetail, userData]);

  const fullName = `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim();

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
              className=" w-130 bg-zinc-100 rounded-lg flex flex-col"
            >
              <div className="border-b border-zinc-300 p-3 flex items-center  justify-between">
                <h1 className="text-xl text-zinc-800 font-medium">
                  Select a Profile Picture
                </h1>
                <button
                  onClick={() => setOpenImageDialogue(false)}
                  type="button"
                  className="text-3xl cursor-pointer"
                >
                  <IoIosClose />
                </button>
              </div>
              <div className="p-6 ">
                {!selectedImage ? (
                  <div className="flex flex-col gap-6">
                    <span className=" text-center text-zinc-600">
                      Click to select image
                    </span>

                    <div className="flex items-center gap-3">
                      <input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          if (file.size > 1024 * 1024) {
                            setError("image", {
                              type: "required",
                              message: "Please select image below 1MB",
                            });
                            return;
                          } else {
                            clearErrors("image");
                          }

                          const reader = new FileReader();
                          reader.onload = () => {
                            setSelectedImage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />

                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer rounded-lg font-thin bg-zinc-200 hover:bg-zinc-300 text-zinc-500 h-26 w-26 transition-all flex items-center justify-center gap-2"
                      >
                        <FiPlus size={30} />
                      </label>

                      {galleryData?.map((item) => (
                        <div
                          onClick={() => setSelectedImage(item.image_url)}
                          key={item._id}
                          className="cursor-pointer h-26 w-26 overflow-hidden rounded-lg"
                        >
                          <img
                            src={item.image_url}
                            className="h-full w-full object-cover"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="max-h-88 overflow-hidden">
                    <Cropper
                      src={selectedImage}
                      style={{ height: 350, width: "100%" }}
                      initialAspectRatio={1}
                      aspectRatio={1}
                      viewMode={1}
                      guides={false}
                      background={false}
                      responsive
                      autoCropArea={1}
                      checkOrientation={false}
                      ref={cropperRef}
                    />
                  </div>
                )}
                {errors.image && (
                  <p className="text-xs mt-2 text-red-500">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div className=" flex border-t p-4 border-zinc-300 justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    resetCropState();
                    setOpenImageDialogue(false);
                  }}
                  className="button"
                >
                  Cancel
                </button>
                <button className="button2">Submit</button>
              </div>
            </form>
          </div>
        </div>
        <div className="h-full w-full rounded-full overflow-hidden">
          <img
            src={
              profileData?.image
                ? profileData?.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQABqQIdskCD9BK0I81EbVfV9tTz320XvJ35A&s"
            }
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-3xl">{fullName}</h1>
      <p className="text-lg text-zinc-600">{profileData?.aboutme}</p>
    </div>
  );
}
