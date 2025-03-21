import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ArrowUp } from "lucide-react";

const videoData = [
  {
    id: 1,
    title: "Rune raises $100,000 for marketing through NFT butterflies sale",
    photo: "/IMG.png",
    likes: 240,
  },
  {
    id: 2,
    title: "Next.js 15 announced with AI-powered routing",
    photo: "/IMG.png",
    likes: 185,
  },
  {
    id: 3,
    title: "React Server Components - The Future of React?",
    photo: "/IMG.png",
    likes: 320,
  },
  {
    id: 4,
    title: "New JavaScript Features You Should Know",
    photo: "/IMG.png",
    likes: 150,
  },
];

export default function VideoDashboard() {
  const [videos, setVideos] = useState(videoData);
  const [page, setPage] = useState(1);
  const limit = 2;

  const moveVideo = (dragIndex, hoverIndex) => {
    const updatedVideos = [...videos];
    const [movedItem] = updatedVideos.splice(dragIndex, 1);
    updatedVideos.splice(hoverIndex, 0, movedItem);
    setVideos(updatedVideos);
  };

  const paginatedVideos = videos.slice((page - 1) * limit, page * limit);

  return (
    <div className="overflow-x-auto py-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 font-semibold text-left">#</th>
              <th className="py-3 px-4 font-semibold text-left">Title</th>
              <th className="py-3 px-4 font-semibold text-left">Likes</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVideos.map((video, index) => (
              <VideoRow
                key={video.id}
                video={video}
                index={index + (page - 1) * limit}
                moveVideo={moveVideo}
              />
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="text-white"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const VideoRow = ({ video, index, moveVideo }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "VIDEO",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "VIDEO",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveVideo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <td className="py-4 px-4 text-white">{video.id}</td>
      <td className="py-4 px-4 text-white">{video.title}</td>
      <td className="py-4 px-4 text-[#9bff00] font-semibold flex items-center gap-2">
        {video.likes} <ArrowUp size={18} className="text-[#9bff00]" />
      </td>
    </tr>
  );
};
