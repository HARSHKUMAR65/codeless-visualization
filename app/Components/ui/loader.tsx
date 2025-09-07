"use client";
import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />

        {/* Loading text */}
        <p className="text-white/80 text-lg tracking-wider animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
