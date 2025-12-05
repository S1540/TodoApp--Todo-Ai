import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Sparkles } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { MessageCircleX } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../assets/Empty red.json";

const Main = () => {
  const [time, setTime] = useState(new Date());
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editID, setEditID] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 2000);
  }, [status]);

  const handleAddTask = async () => {
    if (task && date) {
      let response, data;

      if (editID !== null) {
        response = await fetch(
          `http://localhost:5000/api/edit-task/${editID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task, date }),
          }
        );
        data = await response.json();
        setTasks(tasks.map((t) => (t._id === editID ? data.data : t)));
        setEditID(null);
        setStatus(data.message);
      } else {
        // Add new task
        response = await fetch("http://localhost:5000/api/add-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task, date }),
        });
        data = await response.json();
        console.log(data.message);
        setTasks([...tasks, data.data]);
      }
      setStatus(data.message);
      setTask("");
      setDate("");
    }
  };

  const handleDeleteTask = async (_id) => {
    const deleteItem = await fetch(
      `http://localhost:5000/api/delete-task/${_id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await deleteItem.json();
    setTasks((prev) => prev.filter((item) => item._id !== _id));
    setStatus(data.message);
  };

  const handleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    setIsDropdownOpen(null);
  };

  const handleEditTask = (task, index) => {
    setTask(task.task);
    setDate(task.date);
    setEditIndex(index);
    setEditID(task._id);
    setIsDropdownOpen(null);
  };

  // Count completed tasks
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  return (
    <>
      <section className="bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-800 min-h-screen pt-8 sm:pt-16 text-white px-4">
        {/* Task Section */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 sm:mt-5">
          {/* Logo */}

          <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10 shadow-2xl relative">
            <div className="mb-4 sm:mb-6 text-center flex-shrink-0 fixed left-0 right-0 top-0 z-40 bg-gradient-to-r from-zinc-800 via-gray-900 to-zinc-800 rounded-tl-lg rounded-tr-lg border-b border-gray-500">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2 ">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Todo App
                </h1>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Your intelligent task assistant
              </p>
            </div>

            {/* Header with Time & Date */}
            <div className="flex justify-between items-center px-4 py-3 mt-14 lg:mt-18 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-md border border-white/20 shadow-lg ">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-sm sm:text-base font-medium">
                  {time.toLocaleTimeString()}
                </h2>
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-medium text-gray-300">
                  {time.toLocaleDateString()}
                </h2>
              </div>
            </div>

            {/* Task Input Section */}
            <div className="flex flex-col gap-3">
              {editIndex !== null && (
                <div className="bg-blue-500/20 border border-blue-400/50 rounded-md px-3 py-2 flex items-center justify-between">
                  <span className="text-sm text-blue-300">Editing Task...</span>
                  <button
                    onClick={() => {
                      setEditIndex(null);
                      setTask("");
                      setDate("");
                    }}
                    className="text-blue-300 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value.toUpperCase())}
                placeholder="What do you want to accomplish?"
                className="border border-gray-600/50 rounded-md px-4 py-3 outline-none w-full bg-white/5 backdrop-blur-md shadow-lg text-gray-200 placeholder:text-gray-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-600/50 rounded-md px-4 py-3 outline-none w-full bg-white/5 backdrop-blur-md shadow-lg text-gray-300 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all"
              />

              {/* Action Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleAddTask}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 backdrop-blur-md shadow-lg border border-blue-400/30 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 active:scale-95 font-medium"
                >
                  <Plus size={20} />
                  <span>{editIndex !== null ? "Update Task" : "Add Task"}</span>
                </button>
                <button
                  onClick={() => setTasks([])}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-500 hover:to-red-400 backdrop-blur-md shadow-lg border border-red-400/30 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 font-medium cursor-pointer"
                >
                  <Trash2 size={20} />
                  <span>Clear All</span>
                </button>
              </div>
              <div
                className={`bg-green-600/50 py-1 rounded-md text-center ${
                  status ? "block" : "hidden"
                }`}
              >
                <p>{status}</p>
              </div>
            </div>

            {/* Stats or Additional Info */}
            <div className="flex gap-3 ">
              <div className="flex-1 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                <p className="text-xs text-gray-400 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {completedCount}
                </p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-lg p-4 border border-orange-500/20">
                <p className="text-xs text-gray-400 mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-400">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          {/* Second grid item - Task List */}
          <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10 shadow-2xl relative">
            <h3 className="text-xl font-semibold text-gray-300">Your Tasks</h3>
            {/* Task List */}
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <ul
                  key={index}
                  className={`grid grid-cols-3 gap-2 border-b border-gray-600/50 pb-2 relative ${
                    task.completed
                      ? "bg-green-500/20 px-2 py-1 rounded-md border border-green-400/50"
                      : ""
                  }`}
                >
                  <li
                    className={`py-2 ${
                      task.completed ? "line-through text-green-300" : ""
                    }`}
                  >
                    {task.task}
                  </li>
                  <li
                    className={`py-2 ${
                      task.completed ? "line-through text-green-300" : ""
                    }`}
                  >
                    {task.date}
                  </li>
                  <div className="flex justify-between relative">
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-600 backdrop-blur-md border border-red-400/30 text-white flex items-center justify-center rounded-full w-10 h-10 py-1 px-1 hover:scale-110 active:scale-80 transition-all duration-300 ease-in-out cursor-pointer"
                    >
                      <Trash2 size={30} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setIsDropdownOpen(
                            isDropdownOpen === index ? null : index
                          )
                        }
                        className="bg-gray-400/10 backdrop-blur-md border border-gray-400/30 text-white flex items-center justify-center rounded-full w-10 h-10 hover:scale-110 active:scale-80 transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        {isDropdownOpen === index ? (
                          <MessageCircleX size={30} />
                        ) : (
                          <EllipsisVertical size={30} />
                        )}
                      </button>
                      {isDropdownOpen === index && (
                        <div className="absolute top-12 right-0 flex flex-col bg-gray-800/90 backdrop-blur-md border border-gray-600/50 rounded-md p-2 gap-1 z-50 min-w-[120px]">
                          <button
                            onClick={() => handleComplete(index)}
                            className="hover:bg-gray-700/50 px-3 py-1 rounded text-left whitespace-nowrap"
                          >
                            {task.completed ? "Undo" : "Complete"}
                          </button>
                          <button
                            onClick={() => handleEditTask(task, index)}
                            className="hover:bg-gray-700/50 px-3 py-1 rounded text-left whitespace-nowrap"
                          >
                            Edit Task
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </ul>
              ))
            ) : (
              <div>
                <Lottie animationData={animationData} loop={true} />
                <p className="text-gray-500 text-sm text-center">
                  No tasks yet. Add your first task to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Main;
