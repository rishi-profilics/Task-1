import axios from "../../utils/axios";
import { createContext, useEffect, useState } from "react";

const ActivityContext = createContext(null);

export const ActivityProvider = ({ children }) => {
  const [punchData, setPunchData] = useState(null);
  const [profileImage, setProfileImage] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [filterDateData, setfilterDateData] = useState({
    fromDate:'',
    toDate:''
  })

  const checkPunch = async (data) => {
    try {
      const res = await axios.get("/activity/today", {
        params: {
          fromDate: data.fromDate,
          toDate: data.toDate,
        },
      });
      const userData = res.data.data;
      setPunchData(userData);
      setfilterDateData({fromDate: data.fromDate, toDate: data.toDate})

      // console.log();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGalleryImage = async () => {
    const images = await axios.get("/api/gallery", {
      params: {
        order: "newest",
      },
    });
    setProfileImage(images.data.data[0]?.image_url);
  };

  const fetchProfile = async () => {
    const images = await axios.get("/profile");
    setProfileData(images.data?.data);
  };

  useEffect(() => {
    fetchProfile()
  }, []);

  return (
    <ActivityContext.Provider
      value={{
        punchData,
        setPunchData,
        checkPunch,
        profileData,
        filterDateData,
        fetchGalleryImage,
        profileImage
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityContext;
