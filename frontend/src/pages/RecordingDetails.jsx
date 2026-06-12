import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecordingById, deleteRecording } from '../services/api';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const RecordingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRecording = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRecordingById(id);
        setRecording(response.data.data || response.data);
      } catch (err) {
        console.error('Failed to fetch recording:', err);
        if (err.response?.status === 404) {
          setError('Recording not found.');
        } else {
          setError('Failed to load recording. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecording();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${recording.title}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      await deleteRecording(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete recording:', err);
      alert('Failed to delete recording. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
        <Link to="/" className="text-primary-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="text-primary-600 hover:underline text-sm inline-flex items-center gap-1 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{recording.title}</h1>
            <p className="text-gray-500 mt-1">
              Client: <span className="font-medium text-gray-700">{recording.clientName}</span>
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-60 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {deleting ? 'Deleting...' : 'Delete Recording'}
          </button>
        </div>

        {/* Audio Player */}
        <div className="mb-6">
          <audio controls className="w-full" src={`/uploads/${recording.fileName}`}>
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Uploaded</p>
            <p className="font-medium text-gray-700">{formatDateTime(recording.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">File Size</p>
            <p className="font-medium text-gray-700">{formatFileSize(recording.fileSize)}</p>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">File Name</p>
            <p className="font-medium text-gray-700 truncate">{recording.fileName}</p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Notes</h2>
          {recording.notes ? (
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{recording.notes}</p>
          ) : (
            <p className="text-gray-400 italic text-sm">No notes added for this recording.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingDetails;