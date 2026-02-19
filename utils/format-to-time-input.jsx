import React from "react";

export const formatToTimeInput = (date) => {
  if (!date) return "";

  const getDate = new Date(date);

  const hours = getDate.getHours().toString().padStart(2, "0");
  const minutes = getDate.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
