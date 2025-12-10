"use client";
import React, { useState } from "react";
import { FilePreview } from "@/components/FilePreview";
import { ChatInterface } from "@/components/ChatInterface";
import { uploadFile, sendMessage } from "@/lib/api";

export default function Home() {
  const [filename, setFilename] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    try {
      const res = await uploadFile(e.target.files[0]);
      setFilename(res.filename);
      setFile(e.target.files[0]);
      setPreview(res.preview);
      setMessages([{ role: 'assistant', content: `I've loaded ${res.filename}. How can I help you edit it?` }]);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (msg: string) => {
    if (!filename) return;
    const newMsgs = [...messages, { role: 'user', content: msg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await sendMessage(msg, "default_session", filename);
      setMessages([...newMsgs, { role: 'assistant', content: res.response }]);
      if (res.preview) setPreview(res.preview);
      // Increment refresh key to force reload of Excel sheet if applicable
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: "Error processing request." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Left: Preview */}
      <div className="w-1/2 h-full border-r border-gray-200 relative bg-gray-100">
        {!filename ? (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                AI Agent Workspace
              </h1>
              <p className="text-gray-500 text-lg">Upload Word or Excel documents to start editing with AI.</p>
            </div>

            <label className="cursor-pointer group">
              <div className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-blue-300 rounded-3xl bg-white hover:bg-blue-50 transition-all shadow-sm hover:shadow-md group-hover:border-blue-500">
                <svg className="w-12 h-12 text-blue-400 group-hover:text-blue-600 mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-500 group-hover:text-gray-700 font-medium">Click to upload</span>
                <span className="text-gray-400 text-xs mt-1">.docx, .xlsx</span>
              </div>
              <input type="file" className="hidden" onChange={handleUpload} accept=".docx,.xlsx,.doc,.xls" />
            </label>

            {loading && <p className="mt-6 text-blue-600 font-medium animate-bounce">Uploading...</p>}
          </div>
        ) : (
          <div className="h-full relative flex flex-col">
            <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {filename}
              </span>
              <button onClick={() => { setFilename(null); setFile(null); setMessages([]); setPreview("") }} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                Close File
              </button>
            </div>
            <div className="flex-1 overflow-auto relative">
              <FilePreview content={preview} file={file} filename={filename} refreshKey={refreshKey} />
              {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-600 font-medium">Updating preview...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Chat */}
      <div className="w-1/2 h-full flex flex-col shadow-2xl z-20">
        <div className="h-14 bg-white border-b flex items-center px-6">
          <h2 className="font-bold text-gray-800">Agent Chat</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          {filename ? (
            <ChatInterface messages={messages} onSendMessage={handleSend} isLoading={loading} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
              <p>Upload a file to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
