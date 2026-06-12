import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import RecordingCard from '../components/RecordingCard';
import { getRecordings, deleteRecording } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [recordings, setRecordings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecordings = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecordings(search);
      setRecordings(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
      setError('Failed to load recordings. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  // Debounced search — re-fetch when searchTerm changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecordings(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchRecordings]);

  const handleDelete = async (id) => {
    try {
      await deleteRecording(id);
      setRecordings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete recording:', err);
      alert('Failed to delete recording. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recordings Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {recordings.length} recording{recordings.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Recording
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      ) : recordings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
            />
          </svg>
          <p className="text-gray-500 font-medium">
            {searchTerm ? 'No recordings match your search.' : 'No recordings yet.'}
          </p>
          {!searchTerm && (
            <Link to="/upload" className="text-primary-600 hover:underline text-sm mt-1 inline-block">
              Upload your first recording
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recordings.map((recording) => (
            <RecordingCard key={recording.id} recording={recording} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;