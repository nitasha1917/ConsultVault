import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UploadRecording from './pages/UploadRecording';
import RecordingDetails from './pages/RecordingDetails';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadRecording />} />
          <Route path="/recordings/:id" element={<RecordingDetails />} />
          <Route
            path="*"
            element={
              <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
                <p className="text-gray-500">The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;