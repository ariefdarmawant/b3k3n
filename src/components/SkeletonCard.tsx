import React from "react";

export const SkeletonCard = () => {
  return (
    <React.Fragment>
        {new Array(4).fill(0).map((_, index) => {
          return (
            <div key={index} className="flex flex-col animate-pulse w-[14rem] h-[24rem] mx-auto shadow-lg p-4 bg-gray-400 gap-4">
              <div className="bg-gray-300 h-96" />
              <div className="bg-gray-300 h-4 w-1/2" />
              <div className="bg-gray-300 h-4" />
            </div>
          );
        })}
    </React.Fragment>
  );
};
