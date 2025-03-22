import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ArrowUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function VideoDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const fetchVideos = async (page) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/v1/api/rest/video/PAGINATE",
        {
          page,
          limit,
        }
      );
      if (!response.data.error) {
        setVideos(response.data.list);
        setNumPages(response.data.num_pages);
        console.log("Videos:", response.data.list);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }finally {
      setLoading(false);
    }

  };

  const moveVideo = (dragIndex, hoverIndex) => {
    const updatedVideos = [...videos];
    const [movedItem] = updatedVideos.splice(dragIndex, 1);
    updatedVideos.splice(hoverIndex, 0, movedItem);
    setVideos(updatedVideos);
  };

  return (
    <div className="overflow-x-auto py-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 font-semibold text-left w-[50px]">#</th>
              <th className="py-3 px-4 font-semibold text-left">Title</th>
              <th className="py-3 px-4 font-semibold text-left">Author</th>
              <th className="py-3 px-4 font-semibold text-left items-end gap-2 flex justify-end">
                Most Likes <ChevronDown size={18} className="text-[#9bff00]" />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-white"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  <div className="flex justify-center items-center h-40 ">
                    <motion.div
                      className="w-12 h-12 border-4 border-t-[#9bff00] border-gray-300 rounded-full animate-spin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    {/* <h1>Loading... </h1> */}
                  </div>
                </td>
              </tr>
            ) : videos.length > 0 ? (
              videos.map((video, index) => (
                <VideoRow key={video.id} video={video} index={index} />
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No videos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="text-white"
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-white">
            Page {page} of {numPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(numPages, prev + 1))}
            className="text-white"
            disabled={page === numPages}
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
      className="bg-gray-900 h-[100px] cursor-pointer"
    >
      <td className="py-4 px-4 text-white border-t-1  border-b-1 border-l-1 rounded-l-2xl w-[50px]">
        {video.id}
      </td>
      <td className="py-4 px-4 text-white border-t-1  border-b-1 w-[400px]">
        <div className="flex items-center gap-2">
          <img
            src={video.photo}
            alt=""
            className="h-20 w-[140px] object-cover rounded"
          />
          <p className="text-xl ">{video.title}</p>
        </div>
      </td>
      <td className="py-4 px-4 text-white border-t-1  border-b-1">
        <div className="flex items-center gap-2">
          <img
            src={video.photo}
            alt=""
            className="rounded-full h-[30px] w-[30px] object-cover"
          />
          User {video.user_id}
        </div>
      </td>
      <td className="py-4 px-4 text-[#9bff00] font-semibold border-t-1  border-b-1 border-r-1 rounded-r-2xl border-white">
        <div className="flex items-center justify-end gap-2">
          {video.likes} <ArrowUp size={18} className="text-[#9bff00]" />
        </div>
      </td>
    </tr>
  );
};
