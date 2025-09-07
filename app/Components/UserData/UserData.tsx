"use client";
import { useFetchUserData } from "@/app/hooks/useFile";
import DocumentsTable from "./DocumentTable";
import Loader from "../ui/loader";
import FileUpload from "../FileUpload/FileUploadHome";
const UserTable = () => {
    const { data, isPending } = useFetchUserData(true);
    if (isPending) {
        return <Loader />
    }
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-md my-4">
                <h1 className="text-2xl font-bold text-gray-800">User Data</h1>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="flex-1 md:flex-none border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                    />
                    <FileUpload />
                </div>
            </div>

            <DocumentsTable data={data} />
        </>
    )
};

export default UserTable;


