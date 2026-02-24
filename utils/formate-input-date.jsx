import dayjs from "dayjs";
import React from "react";

export const formattedInputDate = (date) => {
  const dateObj = dayjs(date).format("YYYY-MM-DD")
  return dateObj
};