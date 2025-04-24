import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const TaskForm = React.lazy(() => import('./pages/TaskForm'));

const App = () => {
  return (
    <div>
      {/* Wrap routes with Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/taskform" element={<TaskForm />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
