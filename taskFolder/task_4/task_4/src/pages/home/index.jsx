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
    <div className=" min-h-screen p-24  border-2">
      <Navbar />
      <Headers />
      <DndProvider backend={HTML5Backend}>
        <VideoDashboard />
      </DndProvider>
    </div>
  );
};

// export default Home;


export default Home;
