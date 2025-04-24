import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [assignmanager, setAssignManager] = useState(""); // New field
  const [error, setError] = useState("");
  const [ListManager, setLM] = useState([]);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8000/api/register/", {
        username,
        email,
        password,
        role,
        assignmanager, // Include the assignManager field
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const fetchManagerList = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/managers`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to approve task");
      const data = await response.json();
      console.log(data.managers);
      setLM(data.managers);
    } catch (error) {
      console.error("Approve Error:", error);
    }
  };

  useEffect(() => {
    fetchManagerList();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Sign Up</h1>
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            User Name
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 mb-2">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        {role !== 'manager' ? (<>
            <div className="mb-4">
              <label htmlFor="assignmanager" className="block text-gray-700 mb-2">
                Assign Manager
              </label>
              <select
                id="assignmanager"
                value={assignmanager}
                onChange={(e) => setAssignManager(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={''}>Select Manager</option>
                {ListManager.map((manager) => (
                  <option key={manager.username} value={manager.username}>
                    {manager.username}
                  </option>
                ))}
              </select>
            </div>
        </>) : (<>
          <div className="mb-4">
              <label htmlFor="assignmanager" className="block text-gray-700 mb-2">
                Assign Manager
              </label>
              <select
                id="assignmanager"
                value={assignmanager}
                onChange={(e) => setAssignManager(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={''}>Select Manager</option>
                <option value={'manager'}>Manager</option>

              </select>
            </div>
        </>)}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
