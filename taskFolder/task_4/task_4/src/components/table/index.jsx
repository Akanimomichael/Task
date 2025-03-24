import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
    } finally {
      setLoading(false);
    }
  };

  const moveVideo = (dragIndex, hoverIndex) => {
    setVideos((prevVideos) => {
      const updatedVideos = [...prevVideos];
      const [movedItem] = updatedVideos.splice(dragIndex, 1);
      updatedVideos.splice(hoverIndex, 0, movedItem);
      return updatedVideos;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto py-6 bg-[]">
        <div className="max-w-5xl mx-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead className="text-[#666666] ">
              <tr>
                <th className="py-3 px-4 text-left font-inter font-thin text-[16px] leading-[100%] tracking-normal">
                  #
                </th>
                <th className="py-3 px-4 text-left font-inter font-thin text-[16px] leading-[100%] tracking-normal">
                  Title
                </th>
                <th className="py-3 px-4 text-left font-inter font-thin text-[16px] leading-[100%] tracking-normal">
                  Author
                </th>
                <th className="py-3 px-4 text-right font-inter font-thin text-[16px] leading-[100%] tracking-normal">
                  <div className="flex items-center justify-end gap-2">
                    Most Likes
                    <ChevronDown size={18} className="text-[#9bff00]" />
                  </div>
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
                    </div>
                  </td>
                </tr>
              ) : videos.length > 0 ? (
                videos.map((video, index) => (
                  <VideoRow
                    key={video.id}
                    video={video}
                    index={index}
                    moveVideo={moveVideo}
                  />
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
    </DndProvider>
  );
}

const VideoRow = ({ video, index, moveVideo }) => {
  const ref = React.useRef(null);

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
      if (!ref.current) return;
      if (draggedItem.index === index) return;

      moveVideo(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  drag(drop(ref));

  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className=" h-[100px] cursor-pointer text-[#FFFFFF]"
    >
      <td className="py-4 px-4 text-[#666666] border-t-1 border-b-1 border-l-1 border-[#FFFFFF1F] rounded-l-2xl w-[50px]">
        {video.id}
      </td>
      <td className="py-4 px-4 text-white border-t-1 border-b-1 border-[#FFFFFF1F]  ">
        <div className="flex items-center gap-4">
          <div className=" !w-[118px] !h-[64px]">
            <img
              src={video.photo}
              alt=""
              className=" h-full w-full  rounded-[8px] object-cover"
            />
          </div>

          <p className="text-[#FFFFFF] w-[364px] font-inter font-thin text-[20px] leading-[28px] tracking-normal align-middle ">
            {video.title}
          </p>
        </div>
      </td>
      <td className="py-4 px-4 text-white border-t-1 border-b-1 border-[#FFFFFF1F]">
        <div className="flex items-center gap-2">
          <img
            src={video.photo}
            alt=""
            className="rounded-full h-[30px] w-[30px] object-cover     "
          />
          <p className=" text-[#DBFD51] font-inter font-thin text-[16px] leading-[20px] tracking-normal">
            User {video.user_id}
          </p>
        </div>
      </td>
      <td className="py-4 px-4 font-semibold border-t-1 border-b-1 border-r-1 rounded-r-2xl border-[#FFFFFF1F]">
        <div className="flex items-center justify-end gap-2">
          {video.likes} <ArrowUp size={18} className="text-[#9bff00]" />
        </div>
      </td>
    </tr>
  );
};
