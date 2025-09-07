"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, FileText, FileQuestion } from "lucide-react";
import { useMemo } from "react";
import { useDataDelete, useDownloadFile } from "@/app/hooks/useFile";
import SingleData from "@/components/UserData/SingleDataDialog";
import { useRouter } from 'next/navigation'




type Doc = {
  id: number;
  userId: number;
  documentName: string;
  dataType: "csv" | "excel" | string;
  createdAt: string;
  expiresAt: string | null;
};

export default function DocumentsTable({ data }: { data: Doc[] }) {
  const rows = useMemo(() => data ?? [], [data]);
  const { mutate: deleteData, isPending: isDeletePending } = useDataDelete();
  const { mutate: downloadFile, isPending: isDownloadPending } = useDownloadFile();
  const router = useRouter()
  const fileIcon = (type: string) => {
    if (type?.toLowerCase() === "csv") return <FileText className="w-5 h-5" />;
    if (type?.toLowerCase() === "excel") return <FileSpreadsheet className="w-5 h-5" />;
    return <FileQuestion className="w-5 h-5" />;
  };
  const badgeStyles = (type: string) => {
    if (type?.toLowerCase() === "csv")
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    if (type?.toLowerCase() === "excel")
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
  };

  const hanndleDelete = (id: number) => {
    deleteData({ id });
  }

  const handleDownload = (id: number) => {
    downloadFile(id);
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="overflow-x-auto rounded-2xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm">
              <th className="text-left font-medium px-5 py-3">#</th>
              <th className="text-left font-medium px-5 py-3">Document</th>
              <th className="text-left font-medium px-5 py-3">Type</th>
              <th className="text-left font-medium px-5 py-3">Created</th>
              <th className="text-left font-medium px-5 py-3">Expires</th>
              <th className="text-right font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <AnimatePresence initial={false}>
            <tbody>
              {rows.map((d, idx) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group border-t border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4 text-slate-700">{idx + 1}</td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white ring-1 ring-slate-200 p-2 shadow-sm group-hover:shadow transition-shadow">
                        {fileIcon(d.dataType)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{d.documentName}</span>
                        <span className="text-xs text-slate-500">ID: {d.id} • User: {d.userId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles(d.dataType)}`}>
                      {d.dataType.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-700">{formatDate(d.createdAt)}</td>

                  <td className="px-5 py-4 text-slate-700">
                    {d.expiresAt ? formatDate(d.expiresAt) : <span className="text-slate-4 00">—</span>}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <SingleData id={d.id} />
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800 shadow-sm"
                        onClick={() => router.push(`/dashboard/analyse?id=${d.id}`)}
                      >
                        Analyse Data
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800 shadow-sm"
                        onClick={() => handleDownload(d.id)}
                      >
                        {isDownloadPending ? "Downloading..." : "Download"}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-white shadow-sm"
                        onClick={() => hanndleDelete(d.id)}
                      >
                        {isDeletePending ? "Deleting..." : "Delete"}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    No documents yet.
                  </td>
                </tr>
              )}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </motion.div>
  );
}
