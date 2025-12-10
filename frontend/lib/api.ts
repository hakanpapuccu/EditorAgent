const API_URL = "http://localhost:8000";

export interface ChatResponse {
  response: string;
  preview: string;
}

export interface UploadResponse {
  filename: string;
  filepath: string;
  preview: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
};

export const sendMessage = async (message: string, sessionId: string, filename?: string): Promise<ChatResponse> => {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId, filename }),
  });
  if (!res.ok) throw new Error("Chat failed");
  return res.json();
};
