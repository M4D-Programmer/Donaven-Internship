import React from "react";

const Skeleton = ({ width, height, borderRadius, className = "" }) => {
  return (
    <div
      className={`skeleton-box ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
      }}
    ></div>
  );
};

export default Skeleton;
