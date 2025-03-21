import React from "react";
import Navbar from "../../components/navbar";
import Headers from "../../components/header";
// import TableComponent from "../../components/table";
import VideoDashboard from "../../components/table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import VideoDashboard from
// import VideoDashboard

const Home = () => {
  return (
    <div className="bg-black min-h-screen p-24">
      <Navbar />
      <Headers />
      <DndProvider backend={HTML5Backend}>
        <VideoDashboard />
      </DndProvider>
    </div>
  );
};

export default Home;
