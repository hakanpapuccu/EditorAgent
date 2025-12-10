
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

            // Always try to fetch latest if refreshKey > 0 or if likely a converted/modified file
            const shouldFetch = (refreshKey && refreshKey > 0) || (filename?.toLowerCase().endsWith('.xls') || filename?.toLowerCase().endsWith('.xlsx'));

            if (shouldFetch) {
                // Logic to determine if we need backend fetch
                // 1. Explicit refresh requested (Agent modified file)
                // 2. Format conversion (.xls -> .xlsx)

                const fileIsXls = file.name.toLowerCase().endsWith('.xls');
                const backendFilenameIsXlsx = filename?.toLowerCase().endsWith('.xlsx');
                const explicitRefresh = refreshKey && refreshKey > 0;

                if ((fileIsXls && backendFilenameIsXlsx) || explicitRefresh) {
                    try {
                        console.log(`fetching file version: ${refreshKey}`);
                        // Add query param to avoid cache
                        const response = await fetch(`http://localhost:8000/files/${filename}?v=${refreshKey || 0}`);
                        const blob = await response.blob();
                        fileToLoad = new File([blob], filename || "temp.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    } catch (err) {
                        console.error("Failed to fetch file", err);
                    }
                }
            }

            if (fileToLoad) {
                LuckyExcel.transformExcelToLucky(fileToLoad, (exportJson: any, luckysheetfile: any) => {
                    if (exportJson.sheets == null || exportJson.sheets.length === 0) {
                        console.error("Failed to read the content of the excel file, currently only .xlsx files are supported.");
                        return;
                    }
                    setData(exportJson.sheets);
                }, (err: any) => {
                    console.error("Import failed. Is your file a valid .xlsx?", err);
                });
            }
        };
        loadFile();
    }, [file, filename, refreshKey]);

    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-500">Loading Excel sheet...</span>
            </div>
        )
    }

    return (
        <div className="w-full h-full relative" style={{ height: 'calc(100vh - 100px)' }}>
            <Workbook data={data} onChange={(d: any) => {/* Optional: handle changes */ }} />
        </div>
    );
};
