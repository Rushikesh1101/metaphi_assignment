import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../features/tasks/taskSlice";
import EmployeeDash from "../components/EmployeeDash";
import ManagerDashboard from "../components/ManagerDash";
import Navbar from "../components/Navbar";
import axios from "axios";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, employeeList, status, error } = useSelector(
    (state) => state.tasks
  );

  const [role, setRole] = useState("");
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
    const Loginrole = localStorage.getItem("role");
    setRole(Loginrole);
  }, [status]);

  useEffect(() => {
    const Loginrole = localStorage.getItem("role");
    setRole(Loginrole);
  }, []);

  // Approve handler
  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/tasks/approval/${id}/approve/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to approve task");
      console.log(await response.json());
      dispatch(fetchTasks());
    } catch (error) {
      console.error("Approve Error:", error);
    }
  };

  // Reject handler (with reason)
  const handleReject = async (id, reason) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/tasks/approval/${id}/reject/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ reason }), // Reason must be passed here
        }
      );
      if (!response.ok) throw new Error("Failed to reject task");
      console.log(await response.json());
      dispatch(fetchTasks());
    } catch (error) {
      console.error("Reject Error:", error);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      const data = await response.json();
      console.log("Task updated successfully:", data);
      dispatch(fetchTasks());

      // Update task in the local state if necessary
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  function onRefresh(){
    dispatch(fetchTasks());

  }

  return (
    <div className="p-2 bg-gray-100 min-h-screen space-y-8">
      <Navbar />
      {role === "employee" ? (
        <EmployeeDash
          role={role}
          status={status}
          tasks={tasks}
          error={error}
          updateTask={updateTask}
        />
      ) : (
        <ManagerDashboard
          role={role}
          status={status}
          employees={employeeList}
          tasks={tasks}
          error={error}
          onApprove={handleApprove}
          onReject={handleReject}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default Dashboard;
