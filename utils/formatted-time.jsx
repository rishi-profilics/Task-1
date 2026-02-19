import React from 'react'

  export const formattedTime = (time) => {
    const date = new Date(`1970-01-01T${time}:00`);

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };
