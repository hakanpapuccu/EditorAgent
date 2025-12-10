import React from "react";

interface Props {
    content: string;
}

export const FilePreview: React.FC<Props> = ({ content }) => {
    return (
        <div className="h-full w-full overflow-auto bg-gray-100 p-6 border-r border-gray-300 shadow-inner">
            <h2 className="text-xl font-bold mb-4 text-gray-700">File Preview</h2>
            <div
                className="prose max-w-none bg-white p-6 rounded-lg shadow-sm min-h-[calc(100vh-150px)]"
                dangerouslySetInnerHTML={{ __html: content }}
            />
            {!content && (
                <div className="flex items-center justify-center h-64 text-gray-400">
                    Upload a file to see preview
                </div>
            )}
        </div>
    );
};
