import dayjs from "dayjs";
import React from "react";

export const formattedDate = (date) => {
  const dateObj = dayjs(date).format("MMM DD YYYY")
  return dateObj
};


//todo update date formate to dayjs everywhere
