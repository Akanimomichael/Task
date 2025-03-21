import React from "react";
import { User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-black ">
      <div className="text-xl font-bold text-white">App</div>
      <button className="px-4 py-2 bg-[#9bff00] hover:bg-green-400 rounded-[50px] flex items-center text-black font-semibold gap-2">
        <User size={16} />
        Login
      </button>
    </nav>
  );
};

export default Navbar;
