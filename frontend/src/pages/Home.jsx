import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Task & Time Tracker</h1>
      <p className="text-lg text-gray-700 mb-6">
        Efficiently track your team's tasks and time with ease.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
          Log In
        </Link>
        <Link to="/signup" className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
