// TaskForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {createTask} from "../features/tasks/taskSlice";

const TaskForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    title: "",
    description: "",
    hours_spent: "",
    tags: "",
    task_date: "",
    assignmanager : localStorage.getItem('assignmanager')
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (task.hours > 8) {
      alert("Total hours cannot exceed 8.");
      return;
    }
    dispatch(createTask(task))
      .unwrap()            // if using createAsyncThunk
      .then(() => onSuccess && onSuccess())
      .catch(err => alert("Failed to create task: " + err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="assignmanager" className="block text-sm font-medium text-gray-700">
          Assigned Manager
        </label>
        <input
          id="assignmanager"
          readOnly
          name="assignmanager"
          value={localStorage.getItem('assignmanager')}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={task.description}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      {/* Hours & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="hours_spent" className="block text-sm font-medium text-gray-700">
            Hours
          </label>
          <input
            id="hours_spent"
            name="hours_spent"
            type="number"
            min="0"
            max="8"
            value={task.hours_spent}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="task_date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="task_date"
            name="task_date"
            type="date"
            value={task.task_date}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          value={task.tags}
          onChange={handleChange}
          placeholder="e.g. urgent, client"
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors"
      >
        Submit Task
      </button>
    </form>
  );
};

export default TaskForm;
