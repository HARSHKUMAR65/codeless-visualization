"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons
import { cn } from "@/app/lib/utils"; // Utility from Shadcn
import Image from "next/image";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-md w-64 transform transition-transform duration-200 ease-in-out z-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative md:flex-shrink-0"
        )}
      >
        <div className="p-4 font-bold text-xl border-b">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={300}
            className="mx-auto"
          />
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/welcome" className="block p-2 rounded hover:bg-gray-200">Welcome</Link>
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-200">Home</Link>
          <Link href="/dashboard/profile" className="block p-2 rounded hover:bg-gray-200">Profile</Link>
          <Link href="/dashboard/settings" className="block p-2 rounded hover:bg-gray-200">Settings</Link>
          <div  onClick={() => {console.log("logout")}} className="block p-2 rounded hover:bg-gray-200 cursor-pointer" >Logout</div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <h1 className="font-bold text-lg">Dashboard</h1>
        </header>

        {/* Content */}
        <main className="p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
