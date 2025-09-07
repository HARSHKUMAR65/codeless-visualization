"use client";
import React, { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Button } from "../ui/button";
import { useDataUpload } from "@/app/hooks/useFile";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const ACCEPTED_EXTS = [".csv", ".xlsx", ".xls"];
const ACCEPTED_MIMES = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

type Parsed =
    | { kind: "csv"; rows: Record<string, unknown>[]; meta: Papa.ParseMeta }
    | { kind: "excel"; sheet: string; rows: Record<string, unknown>[] };

const FileUpload: React.FC = () => {
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "parsing" | "done">("idle");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { mutate: uploadData, isPending: dataUploadLoader } = useDataUpload();

    const isAcceptedFile = (file: File): boolean => {
        const nameOk = ACCEPTED_EXTS.some((ext) =>
            file.name.toLowerCase().endsWith(ext)
        );
        const typeOk = ACCEPTED_MIMES.includes(file.type) || file.type === "";
        return nameOk || typeOk;
    };

    const parseCSV = (file: File): Promise<Parsed> =>
        new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) =>
                    resolve({
                        kind: "csv",
                        rows: results.data as Record<string, unknown>[],
                        meta: results.meta,
                    }),
                error: (err) => reject(err),
            });
        });

    const parseExcel = async (file: File): Promise<Parsed> => {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
            defval: "",
        });
        return { kind: "excel", sheet: firstSheetName, rows: json };
    };

    const handleFile = useCallback(
        async (file: File) => {
            setError("");
            setStatus("parsing");
            setFileName(file.name);

            if (!isAcceptedFile(file)) {
                setStatus("idle");
                setError("Please upload a CSV, XLSX, or XLS file.");
                return;
            }

            try {
                const lower = file.name.toLowerCase();
                let parsed: Parsed;
                if (lower.endsWith(".csv")) {
                    parsed = await parseCSV(file);
                    const Data = {
                        documentName: lower,
                        dataType: "csv",
                        data: parsed.rows,
                    };
                    uploadData(Data);
                } else if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
                    parsed = await parseExcel(file);
                    const Data = {
                        documentName: lower,
                        dataType: "excel",
                        data: parsed.rows,
                    };
                    uploadData(Data);
                } else {
                    setStatus("idle");
                    setError("Unsupported file type.");
                    return;
                }

                setStatus("done");
                setTimeout(() => setIsDialogOpen(false), 1500);
            } catch (e) {
                console.error(e);
                setStatus("idle");
                setError("Failed to read the file. Check console for details.");
            }
        },
        [uploadData]
    );

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        if (inputRef.current) inputRef.current.value = "";
    };

    const onDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const onDragOver: React.DragEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const onDragLeave = () => setDragOver(false);

    const resetState = () => {
        setError("");
        setFileName("");
        setStatus("idle");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>{dataUploadLoader ? "Uploading..." : "Upload File"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>File Upload</DialogTitle>
                    <DialogDescription>
                        Upload an Excel (.xlsx/.xls) or CSV (.csv) file. The parsed data will
                        be processed.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* Dropzone */}
                    <label
                        htmlFor="file-input"
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        className={[
                            "block cursor-pointer rounded-2xl border-2 border-dashed bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-sm",
                            "transition-all duration-200 ease-out",
                            dragOver
                                ? "scale-[1.01] border-indigo-500 ring-4 ring-indigo-100"
                                : "border-slate-300 hover:shadow-md",
                        ].join(" ")}
                    >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition-transform duration-200 ease-out group-hover:scale-105">
                            <svg
                                className={`h-6 w-6 ${dragOver ? "animate-bounce" : "animate-pulse"} text-black`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 15.75V18a3 3 0 003 3h12a3 3 0 003-3v-2.25M7.5 9l4.5-4.5L16.5 9M12 4.5V15"
                                />
                            </svg>
                        </div>

                        <div className="mt-3">
                            <span className="font-medium text-slate-900">Drag & drop</span>{" "}
                            <span className="text-slate-600">your file here, or</span>
                        </div>
                        <div className="my-4">
                            <Button size="sm">Choose File</Button>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Allowed: <code>.csv</code>, <code>.xlsx</code>, <code>.xls</code>
                        </p>
                    </label>

                    {/* Hidden input */}
                    <input
                        id="file-input"
                        ref={inputRef}
                        type="file"
                        onChange={onInputChange}
                        accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="hidden"
                    />

                    {/* Status / feedback */}
                    <div className="min-h-[2.25rem]">
                        {error && (
                            <div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                {error}
                            </div>
                        )}
                        {!error && status === "parsing" && (
                            <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-indigo-600" />
                                Parsing <span className="font-medium">{fileName}</span> …
                            </div>
                        )}
                        {!error && status === "done" && (
                            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                                Successfully parsed <span className="font-medium">{fileName}</span>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={resetState}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FileUpload;