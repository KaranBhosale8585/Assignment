"use client";

import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Header from "@/components/AdminHeader";

export default function UploadPage() {
  // State to hold the selected file
  const [file, setFile] = useState(null);
  // Loading state during upload process
  const [uploading, setUploading] = useState(false);

  // Handles the file upload and task distribution API call
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file to upload."); // Validate file presence before upload

    const formData = new FormData();
    formData.append("file", file); // Append file to FormData for multipart/form-data request

    setUploading(true); // Start loading state
    try {
      // POST request to API for uploading file and distributing leads
      const res = await fetch("/api/sendLeads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed."); // Error handling for failed upload

      toast.success(data.message || "File uploaded and tasks distributed!"); // Success notification
      setFile(null); // Reset file input after successful upload
    } catch (err) {
      toast.error(err.message || "Something went wrong."); // Catch and show upload errors
    } finally {
      setUploading(false); // Stop loading state after completion
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 text-black flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md border">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FileUp className="text-blue-600" />
            Upload Leads CSV/XLSX
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              Choose a file (CSV, XLS, XLSX)
            </span>
            {/* File input for CSV/XLS/XLSX files */}
            <input
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={(e) => setFile(e.target.files[0])} // Update state with selected file
              className="block w-full text-sm file:bg-blue-50 file:border file:border-blue-200 file:rounded-md file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
          </label>

          {/* Upload button disabled during upload */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex justify-center items-center gap-2 transition disabled:opacity-50"
          >
            {uploading ? (
              <>
                {/* Loading spinner icon while uploading */}
                <Loader2 className="animate-spin size-5" />
                Uploading...
              </>
            ) : (
              <>
                {/* Upload icon */}
                <FileUp className="size-5" />
                Upload & Distribute
              </>
            )}
          </button>
        </div>
      </main>
    </>
  );
}
