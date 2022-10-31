import { useEffect } from "react";
import { TabsProps } from "../types";

const Tabs = ({ activeTabs, handleChange }: TabsProps) => {
  useEffect(() => {
    console.log(activeTabs);
  }, [activeTabs]);
  return (
    <div className="grid grid-cols-2 text-center cursor-pointer">
      <div
        className={(activeTabs === "browse" ? " border-b border-b-blue-400 " : "") + "py-4"}
        onClick={() => handleChange("browse")}
      >
        Browse Books
      </div>
      <div
        className={(activeTabs === "bookmark" ? " border-b border-b-blue-400 " : "") + "py-4"}
        onClick={() => handleChange("bookmark")}
      >
        Your Bookmark
      </div>
    </div>
  );
};

export default Tabs;
