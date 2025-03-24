import React from "react";
import { User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-[] ">
      <div
        className="text-xl text-[#FFFFFF] font-inter font-black text-[48px] leading-[20px] tracking-normal
"
      >
        App
      </div>
      <button
        className="px-4 py-2 bg-[#9bff00] w-[128px] h-[48px] top-[24px] left-[1078px]
 flex items-center justify-center gap-2 rounded-[50px]"
      >
        <User size={24} className="w-6 h-6" />

        <p
          className="font-inter font-thin text-[16px] leading-[20px] tracking-normal
"
        >
          Login
        </p>
      </button>
    </nav>
  );
};

export default Navbar;
