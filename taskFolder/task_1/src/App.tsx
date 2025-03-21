import React from "react";
import { ReactFlowProvider } from "reactflow";
import { Sidebar } from "./components/Sidebar";
import { FlowProvider } from "./store/FlowContext";

function App() {
  return (
    <div className="w-full h-screen">
      <ReactFlowProvider>
        <FlowProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 bg-white" />
          </div>
        </FlowProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
