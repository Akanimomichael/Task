import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-[] p-4 ">
      {/* Left: Title */}
      <h1
        className=" text-[#FFFFFF] font-inter font-thin text-[40px] leading-[48px] tracking-normal
"
      >
        Today’s Leaderboard
      </h1>

      {/* Right: Date, Submission Open, and Time */}
      <div className="w-[418px] h-[56px] rounded-[16px]  flex items-center space-x-4 p-2 px-3  text-[]  pl-4  bg-[#ffffff3e]">
        <span
          className="font-inter text-[#FFFFFF] font-thin text-[16px] leading-[20px] tracking-normal
"
        >
          30 May 2025
        </span>
        <div className="text-[#696969] pb-2  flex items-center justify-center text-[16px] font-bold">
          .
        </div>
        <div
          className="w-[156px] h-[25px] bg-[#9bff00] rounded-[8px] gap-[8px] p-[4px_10px]
"
        >
          <span
            className="text-[#000000] flex items-center justify-center font-inter font-thin text-[14px] leading-[100%] tracking-normal uppercase
"
          >
            {" "}
            Submission Open
          </span>
        </div>
        {/* <span className="text-black font-semibold bg-[#9bff00] rounded-[50px] p-2 px-3 ">
          Submission Open
        </span> */}
        <div className="text-[#696969] pb-2  flex items-center justify-center text-[16px] font-bold">
          .
        </div>
        <span
          className="font-inter text-[#FFFFFF] font-thin text-[16px] leading-[20px] tracking-normal
"
        >
          11:00
        </span>
      </div>
    </header>
  );
};

export default Header;
