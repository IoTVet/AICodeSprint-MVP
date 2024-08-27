import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {CloudIcon, DocumentTextIcon} from '@heroicons/react/24/outline';
import { applicantService } from '../../api/services/jobPostingService';
import {toast} from "react-toastify";
import {CloudUpload, CloudUploadOutline} from "heroicons-react";

interface ApplicantUploadProps {
  jobPostingId: number;
  onUploadSuccess: () => void;
  onClose: () => void; // Add this line
}

const ApplicantUpload: React.FC<ApplicantUploadProps> = ({
  jobPostingId,
  onUploadSuccess,
  onClose
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState({
    name: '',
    email: '',
    resumeText: '',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
  const formData = new FormData();
  acceptedFiles.forEach(file => {
    formData.append('resume', file);
  });
  handleFileUpload(formData);
}, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = async (formData: FormData) => {
  try {
    // Combine the jobPostingId and formData into a single object
    const applicantData = {
      ...Object.fromEntries(formData),
      job_posting: jobPostingId
    };

    await applicantService.create(applicantData);
    onUploadSuccess();
    toast.success('Resume uploaded successfully');
  } catch (error) {
    console.error('Error uploading resume:', error);
    toast.error('Error uploading resume');
  }
};

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await applicantService.submitText({
        job_posting: jobPostingId,
        content: manualInput.resumeText,
        student_name: manualInput.name,
      });
      onUploadSuccess();
      setShowManualInput(false);
      setManualInput({ name: '', email: '', resumeText: '' });
      toast.success('Applicant information submitted successfully');
    } catch (error) {
      console.error('Error submitting applicant information:', error);
      toast.error('Error submitting applicant information');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <CloudIcon className="h-8 w-8 mr-2 text-indigo-600" />
        Upload Applicants
      </h2>
      <div className="flex space-x-4">
        <div
          {...getRootProps()}
          className={`flex-1 p-10 border-2 border-dashed rounded-lg text-center transition-colors duration-300 ${
            isDragActive ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          <input {...getInputProps()} />
          <CloudIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Drag 'n' drop resume files here, or click to select files</p>
        </div>
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
        >
          <DocumentTextIcon className="mr-2 h-5 w-5" />
          Manual Input
        </button>
      </div>

      {showManualInput && (
          <motion.form
              initial={{opacity: 0, height: 0}}
              animate={{opacity: 1, height: 'auto'}}
              exit={{opacity: 0, height: 0}}
              transition={{duration: 0.3}}
              onSubmit={handleManualSubmit}
              className="mt-6 space-y-4"
          >
            <input
                type="text"
                placeholder="Applicant Name"
                value={manualInput.name}
                onChange={(e) => setManualInput({...manualInput, name: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
            />
            <input
                type="email"
                placeholder="Applicant Email"
                value={manualInput.email}
                onChange={(e) => setManualInput({...manualInput, email: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
            />
            <textarea
                placeholder="Paste resume text here"
                value={manualInput.resumeText}
                onChange={(e) => setManualInput({...manualInput, resumeText: e.target.value})}
                className="w-full p-2 border rounded-md h-40"
                required
            />
            <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Applicant Information
            </button>
            <button onClick={onClose}>Close</button>

          </motion.form>
      )}
    </motion.div>
  );
};

export default ApplicantUpload;