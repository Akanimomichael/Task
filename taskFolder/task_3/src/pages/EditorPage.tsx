import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, GripHorizontal } from "lucide-react";
import { useDocumentStore } from "../store/documentStore";
import { ProgressBar } from "../components/ProgressBar";
import { PDFViewer } from "../components/PDFViewer";
import { EditorSidebar } from "../components/EditorSidebar";
import type { DocumentField } from "../types";
// import { useEffect } from "react"; // For event listeners
// import { Resizable } from "re-resizable"; // Optional: React library for resizing


const FIELD_DEFAULT_SIZES = {
  signature: { width: 100, height: 50 },
  text: { width: 100, height: 40 },
  date: { width: 150, height: 40 },
  checkbox: { width: 30, height: 30 },
  initial: { width: 100, height: 50 },
};

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDocument, addField, updateField, updateDocument } =
    useDocumentStore();
  const [selectedField, setSelectedField] = useState<DocumentField | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  if (!currentDocument || !containerRef.current) return;

  const type = e.dataTransfer.getData("fieldType") as DocumentField["type"];
  if (!type) return;

  const pdfPage = containerRef.current.querySelector(
    ".react-pdf__Page"
  ) as HTMLDivElement;
  if (!pdfPage) return;

  const rect = pdfPage.getBoundingClientRect();
  const scaleX = pdfPage.offsetWidth / rect.width;
  const scaleY = pdfPage.offsetHeight / rect.height;

  // Adjust for field size
  const fieldWidth = FIELD_DEFAULT_SIZES[type].width;
  const fieldHeight = FIELD_DEFAULT_SIZES[type].height;

  // Center the drop position based on the field's width and height
  const x =
    (((e.clientX - rect.left - fieldWidth / 2) * scaleX) /
      pdfPage.offsetWidth) *
    100;
  const y =
    (((e.clientY - rect.top - fieldHeight / 2) * scaleY) /
      pdfPage.offsetHeight) *
    100;

  // Ensure values stay within the valid range (0-100)
  const newField: DocumentField = {
    id: crypto.randomUUID(),
    type,
    recipientId: currentDocument.recipients[0].id,
    position: {
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100)),
    },
    size: FIELD_DEFAULT_SIZES[type],
    required: true,
    page: currentPage,
  };

  addField(currentDocument.id, newField);
  setSelectedField(newField);
};



  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

 const handleSave = () => {
   
   if (currentDocument) {
     updateDocument(currentDocument);
   }
   navigate("/summary"); 
 };


  if (!currentDocument) {
    navigate("/upload");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <ProgressBar />
      </div>

      <div className="flex flex-1">
        <EditorSidebar />

        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Document Editor</h2>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>

          <div
            ref={containerRef}
            className="bg-gray-100 rounded-lg p-4 flex justify-center relative overflow-auto min-h-[600px]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="relative">
              {currentDocument.file && (
                <PDFViewer
                  file={currentDocument.file}
                  pageNumber={currentPage}
                  onPageChange={setCurrentPage}
                  onLoadSuccess={setTotalPages}
                />
              )}
              {currentDocument.fields
                .filter((field) => field.page === currentPage)
                .map((field) => (
                  <div
                    key={field.id}
                    style={{
                      position: "absolute",
                      left: `${field.position.x}%`,
                      top: `${field.position.y}%`,
                      width: field.size.width,
                      height: field.size.height,
                    }}
                    className="  border-none  border-blue-500 bg-white/80 rounded-md shadow-sm p-1"
                  >
                    <div className="text-xs bg-blue-500 h text-white px-2 py-1 flex items-center justify-between rounded-t-sm">
                      <span className="capitalize">{field.type}</span>
                      <GripHorizontal className="w-3 h-3 cursor-move" />
                    </div>

                    {field.type === "text" ? (
                      <input
                        type="text"
                        value={field.value || ""}
                        onChange={(e) =>
                          updateField(currentDocument.id, {
                            ...field,
                            value: e.target.value,
                          })
                        }
                        className="w-full h-full p-1 border-2 outline-none bg-transparent text-black"
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
