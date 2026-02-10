import axios from "../../utils/axios";
import { createContext, useState } from "react";

const ActivityContext = createContext(null);

export const ActivityProvider = ({ children }) => {
  const [punchData, setPunchData] = useState(null);

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

      // console.log();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        punchData,
        setPunchData,
        checkPunch,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityContext;
