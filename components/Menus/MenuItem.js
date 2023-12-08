import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

const MenuItem = (props) => {
  const router = useRouter();
  const { menu, icon, destination } = props;
  const { expandedLeftSidebar, activeMenu, setActiveMenu } = useUserContext();
  const clickHandler = () => {
    setActiveMenu(menu);
    router.push(destination);
  };
  return (
    <div onClick={clickHandler} className={`${activeMenu === menu && "bg-violet-800"} transition-all duration-500 ${expandedLeftSidebar && "rounded-lg"} ${expandedLeftSidebar ? "p-4" : "py-4"} text-white flex items-center cursor-pointer gap-4 ${activeMenu != menu && "hover:bg-theme3"}`}>
      <div className={`flex transition-all duration-500 gap-4 ${!expandedLeftSidebar && "ml-[28px]"}`}>
        <div className={`relative w-6 h-6`}>
          <Image className={`transition-all duration-500`} src={`/${icon}.svg`} fill="true" sizes="32x32" alt="accounts" />
        </div>
        <div className={`transition-all duration-500 ${!expandedLeftSidebar && "ml-8"}`}> {menu} </div>
      </div>
    </div>
  );
};

export default MenuItem;
