
import React, { useEffect, useState } from 'react';
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
// @ts-ignore
import LuckyExcel from 'luckyexcel';

interface Props {
    file: File;
    filename?: string | null;
    refreshKey?: number;
}

export const ExcelSheet: React.FC<Props> = ({ file, filename, refreshKey }) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const loadFile = async () => {
            let fileToLoad = file;

            // Determine if we need to fetch from backend
            const fileIsXls = file.name.toLowerCase().endsWith('.xls');
            const backendFilenameIsXlsx = filename?.toLowerCase().endsWith('.xlsx');
            const explicitRefresh = refreshKey && refreshKey > 0;

            // Only fetch from backend if:
            // 1. Agent has modified the file (refreshKey > 0), OR
            // 2. File format was converted (.xls -> .xlsx)
            const shouldFetch = explicitRefresh || (fileIsXls && backendFilenameIsXlsx);

            if (shouldFetch) {
                try {
                    console.log(`fetching file version: ${refreshKey}`);
                    const response = await fetch(`http://localhost:8000/files/${filename}?v=${refreshKey || 0}`);

                    if (!response.ok) {
                        throw new Error(`Failed to fetch file: ${response.statusText}`);
                    }

                    const blob = await response.blob();

                    if (blob.size === 0) {
                        throw new Error('Fetched file is empty');
                    }

                    fileToLoad = new File([blob], filename || "temp.xlsx", {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });

                    console.log(`Fetched file size: ${blob.size} bytes`);
                } catch (err) {
                    console.error("Failed to fetch file", err);
                    // Do NOT fall back silently. Alert the user or show error state.
                    // fileToLoad = file; // Only fallback if initial load?
                    // Actually, if update fails, we should warn user.
                    if (refreshKey && refreshKey > 0) {
                        alert("Failed to load updated file. Viewing previous version.");
                        fileToLoad = file;
                    } else {
                        fileToLoad = file;
                    }
                }
            }

            if (fileToLoad) {
                try {
                    console.log(`Loading file: ${fileToLoad.name}, size: ${fileToLoad.size} bytes`);

                    LuckyExcel.transformExcelToLucky(fileToLoad, (exportJson: any, luckysheetfile: any) => {
                        if (exportJson.sheets == null || exportJson.sheets.length === 0) {
                            console.error("Failed to read the content of the excel file.");
                            alert("Failed to parse Excel file. It might be corrupted or empty.");
                            return;
                        }
                        console.log(`Successfully loaded ${exportJson.sheets.length} sheet(s)`);
                        setData(exportJson.sheets);
                    }, (err: any) => {
                        console.error("LuckyExcel import failed.", err);
                        alert("Failed to open Excel file. The agent might have corrupted the file structure.");
                    });
                } catch (err) {
                    console.error("Error during transformExcelToLucky:", err);
                }
            }
        };
        loadFile();
    }, [file, filename, refreshKey]);

    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-full flex-col gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-500">Loading Excel sheet...</span>
                <span className="text-xs text-gray-400">Version: {refreshKey}</span>
            </div>
        )
    }

    return (
        <div className="w-full h-full relative" style={{ height: 'calc(100vh - 100px)' }}>
            <Workbook key={refreshKey} data={data} onChange={(d: any) => {/* Optional: handle changes */ }} />
        </div>
    );
};
