import React from "react";
import { FileTree } from "./FileTree";
import { CodeEditor } from "./CodeEditor";
import { EditorTabs } from "./EditorTabs";
import { EditorNavBar } from "./EditorNavBar";
import { Breadcrumb } from "./Breadcrumb";

export function Editor() {
  const [currentFile, setCurrentFile] = React.useState("/src/App.tsx");
  const [files, setFiles] = React.useState({
    "/src/App.tsx": `// App.tsx
import React from 'react';
import { Prompt } from './components/Prompt';
import { Chat } from './components/Chat';
import { Editor } from './components/Editor';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="text-xl font-bold text-blue-500">bolt.new</div>
      </header>
      
      <Prompt />
      
      <main className="flex-1 grid grid-cols-2 gap-4 p-4">
        <Chat />
        <Editor />
      </main>
    </div>
  );
}
export default App;`,

    "/src/components/Prompt.tsx": `// Prompt.tsx
import React from 'react';

export function Prompt() {
  return <div>Prompt Component</div>;
}`,

    "/src/components/Chat.tsx": `// Chat.tsx
import React from 'react';

export function Chat() {
  return <div>Chat Component</div>;
}`,

    "/src/components/Editor.tsx": `// Editor.tsx
import React from 'react';

export function Editor() {
  return <div>Editor Component</div>;
}`,
  });

  const [code, setCode] = React.useState(files[currentFile]); // Initialize with the correct file

  // Update code when `currentFile` changes
  React.useEffect(() => {
    setCode(files[currentFile] || "// New file");
  }, [currentFile, files]); // Also listen to `files` to ensure updates

  return (
    <>
      <EditorTabs />
      <EditorNavBar />
      <div className="h-full flex bg-[#1E1E1E]">
        <FileTree onFileSelect={(path) => setCurrentFile(path)} />
        <div className="flex-1 flex flex-col">
          <Breadcrumb path={currentFile} />
          <CodeEditor
            value={code}
            onChange={(newCode) => {
              setCode(newCode);
              setFiles((prevFiles) => ({
                ...prevFiles,
                [currentFile]: newCode,
              }));
            }}
          />
        </div>
      </div>
    </>
  );
}
