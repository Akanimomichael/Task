import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDocumentStore } from "../store/documentStore";
import { PDFViewer } from "../components/PDFViewer";

export const PreviewPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { documents } = useDocumentStore();
  const document = documents.find((d) => d.id === documentId);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="relative flex flex-col items-center bg-gray-100 min-h-screen py-4">
      <h1 className="text-xl font-bold mb-4">{document?.name}</h1>

      <div className="relative">
        {document?.file && (
          <PDFViewer
            file={document.file}
            pageNumber={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Field Rendering (Positioning Fix) */}
        {document?.fields
          ?.filter((field) => field.page === currentPage)
          .map((field) => (
            <div
              key={field.id}
              style={{
                position: "absolute",
                left: `${field.position.x}%`, // Fix: Use stored percentage directly
                top: `${field.position.y}%`,
                width: `${field.size.width}px`, // Ensure width matches EditorPage
                height: `${field.size.height}px`,
              }}
              className="bg-white"
            >
              {field.type === "text" ? (
                <span className="text-black">{field.value}</span>
              ) : (
                <span className="text-gray-500">[Signature]</span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
