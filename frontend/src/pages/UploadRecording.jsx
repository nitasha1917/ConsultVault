import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadRecording } from '../services/api';

const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/m4a', 'audio/x-m4a'];
const MAX_SIZE_MB = 50;

const UploadRecording = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    notes: '',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) {
      setFile(null);
      return;
    }

    // Basic client-side validation
    const sizeMB = selected.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setErrors((prev) => ({ ...prev, file: `File must be smaller than ${MAX_SIZE_MB}MB.` }));
      setFile(null);
      return;
    }

    const validExtension = /\.(mp3|wav|m4a)$/i.test(selected.name);
    if (!validExtension) {
      setErrors((prev) => ({ ...prev, file: 'Only .mp3, .wav, and .m4a files are allowed.' }));
      setFile(null);
      return;
    }

    setErrors((prev) => ({ ...prev, file: '' }));
    setFile(selected);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required.';
    if (!file) newErrors.file = 'Please select an audio file.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('clientName', formData.clientName.trim());
    payload.append('notes', formData.notes.trim());
    payload.append('audio', file);

    setSubmitting(true);
    try {
      const response = await uploadRecording(payload);
      const newRecording = response.data.data || response.data;
      navigate(`/recordings/${newRecording.id}`);
    } catch (err) {
      console.error('Upload failed:', err);
      const message =
        err.response?.data?.message || 'Failed to upload recording. Please try again.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Upload Recording</h1>
      <p className="text-gray-500 text-sm mb-6">
        Add a new consultation recording with its details.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Consultation Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Initial Consultation - Estate Planning"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.title ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Client Name */}
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.clientName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional context or notes about this consultation..."
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1">
            Audio File <span className="text-red-500">*</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <input
              type="file"
              id="audio"
              name="audio"
              accept=".mp3,.wav,.m4a,audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="audio" className="cursor-pointer block">
              <svg
                className="w-10 h-10 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {file ? (
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-primary-600">Click to upload audio file</p>
                  <p className="text-xs text-gray-400 mt-1">MP3, WAV, or M4A (max {MAX_SIZE_MB}MB)</p>
                </>
              )}
            </label>
          </div>
          {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full"></div>
                Uploading...
              </>
            ) : (
              'Upload Recording'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={submitting}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadRecording;