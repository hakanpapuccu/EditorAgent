import React from "react";
import dynamic from 'next/dynamic';

const ExcelSheet = dynamic(() => import('./ExcelSheet').then(mod => mod.ExcelSheet), {
    ssr: false,
    loading: () => <p>Loading Spreadsheet...</p>
});

interface Props {
    content: string;
    file?: File | null;
    filename?: string | null;
    refreshKey?: number;
}

export const FilePreview: React.FC<Props> = ({ content, file, filename, refreshKey }) => {
    const isExcel = filename?.toLowerCase().endsWith('.xlsx') || filename?.toLowerCase().endsWith('.xls');

    if (isExcel && file) {
        return (
            <div className="h-full w-full overflow-hidden bg-white border-r border-gray-300 shadow-inner flex flex-col">
                <div className="p-2 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-gray-700">Excel Editor</h2>
                    <span className="text-xs text-gray-400">Powered by FortuneSheet</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ExcelSheet file={file} filename={filename} refreshKey={refreshKey} />
                </div>
            </div>
        );
    }

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


