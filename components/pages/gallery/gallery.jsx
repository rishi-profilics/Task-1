import React, { useContext, useEffect, useRef, useState } from "react";
import Layout from "../../ui/layout";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useForm } from "react-hook-form";
import { IoIosClose } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import TablePagination from "@mui/material/TablePagination";
import ActivityContext from "../../../src/context/activity-context";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageDialogue, setOpenImageDialogue] = useState(false);
  const [updateDeleteDialogue, setUpdateDeleteDialogue] = useState(false);
  const [imageData, setImageData] = useState(null);
  const {fetchGalleryImage}  = useContext(ActivityContext)
  const [sort, setSort] = useState("newest");
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const [galleryData, setGalleryData] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const getGalleryImages = async () => {
    try {
      const images = await axios.get("/api/gallery", {
        params: {
          order: sort,
        },
      });
      setGalleryData(images.data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const paginatedData = galleryData?.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  );

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

      toast.success("Image has been added to the gallery");

      getGalleryImages();
      resetCropState();
      setOpenImageDialogue(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageDelete = async (id) => {
    try {
      await axios.delete(`/api/gallery/${id}`)
      getGalleryImages()
      setUpdateDeleteDialogue(false);
      toast.success("Image has been deleted Successfully")
      fetchGalleryImage()
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function downloadImage() {
  const imageUrl = imageData?.image_url;
  
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'downloaded-image.jpg'; 
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Image downloaded successfully")
  } catch (error) {
    console.error("Download failed:", error);
  }
}


  const handleImageUpdateDeleteDialogue = async (id) => {
    try {
      const data = await axios(`/api/gallery/${id}`);
      setImageData(data?.data.data);
      setUpdateDeleteDialogue(true);
    } catch (error) {}
  };

  const resetCropState = () => {
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

    useEffect(() => {
      if (!galleryData) return;
  
      const totalPages = Math.ceil(galleryData.length / rowsPerPage);
  
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }
    }, [galleryData]);

  useEffect(() => {
    getGalleryImages();
  }, [sort]);

  function ImageUpdateDeleteDialogue() {
    return (
      <div
        className={`${!updateDeleteDialogue && "hidden"} fixed inset-0 bg-black/30 flex items-center justify-center z-20`}
      >
        <div className="w-190 bg-zinc-100 rounded-lg flex flex-col">
          <div className="border-b border-zinc-300 p-4 flex items-center  justify-between">
            <h1 className="text-xl text-zinc-800 font-medium">Upload Image</h1>
            <button
              onClick={() => setUpdateDeleteDialogue(false)}
              type="button"
              className="text-3xl cursor-pointer"
            >
              <IoIosClose />
            </button>
          </div>

          <div className="h-100 p-4">
            <img
              src={imageData?.image_url}
              className="h-full w-full object-contain"
              alt=""
            />
          </div>

          <div className=" flex border-t p-4 border-zinc-300 justify-end gap-4">
            <button onClick={() => handleImageDelete(imageData?._id)} type="button" className="button">
              Delete
            </button>
            <button onClick={downloadImage} className="button2">Download</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="bg-zinc-100 p-4 w-full flex items-center justify-between rounded-lg">
          <TablePagination
            component="div"
            count={galleryData?.length}
            className="border-b-0"
            page={page}
            rowsPerPage={rowsPerPage}
            shape="rounded"
            onPageChange={(event, value) => setPage(value)}
            rowsPerPageOptions={[rowsPerPage]}
          />

          <div className="flex items-center gap-3">
            <select
              className="button"
              onChange={(e) => setSort(e.target.value)}
              name="sort"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button
              onClick={() => setOpenImageDialogue(true)}
              className="button2"
            >
              Upload Now
            </button>
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
              <div className="border-b border-zinc-300 p-4 flex items-center  justify-between">
                <h1 className="text-xl text-zinc-800 font-medium">
                  Upload Image
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
                  <div className="flex flex-col">
                    <span className=" text-zinc-700 font-semibold">
                      Select image
                    </span>

                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="input"
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

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:p-6">
          {paginatedData?.map((item) => (
            <div
              onClick={() => handleImageUpdateDeleteDialogue(item._id)}
              key={item._id}
              className="rounded-lg cursor-pointer h-45 overflow-hidden"
            >
              <img
                src={item.image_url}
                className="h-full w-full object-cover"
                alt=""
              />
            </div>
          ))}
          <ImageUpdateDeleteDialogue />
        </div>
      </div>
    </Layout>
  );
}
