import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-black p-4 shadow-md ">
      {/* Left: Title */}
      <h1 className="text-xl font-bold text-white">Today’s Leaderboard</h1>

      {/* Right: Date, Submission Open, and Time */}
      <div className="flex items-center space-x-4 p-2 px-3 rounded-3xl text-white border-2 pl-4 border-gray-700 bg-gray-700">
        <span className="font-medium">30 May 2025</span>
        <span className="text-black font-semibold bg-[#9bff00] rounded-[50px] p-2 px-3 ">
          Submission Open
        </span>
        <span className="font-medium">11:00</span>
      </div>
    </header>
  );
};

export default Header;
