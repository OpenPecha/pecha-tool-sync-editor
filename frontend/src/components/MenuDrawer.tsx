import React, { useState } from "react";

import { FaCog } from "react-icons/fa";
import SyncOptions from "./SyncOptions";
import useScrollHook from "@/hooks/useScrollHook";

function MenuDrawer({ quill1Ref, quill2Ref }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { syncMode, setSyncMode, htmlTag, setSelectedHtmlTag } = useScrollHook(
    quill1Ref,
    quill2Ref
  );
  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
        aria-label="Settings"
      >
        <FaCog className="w-6 h-6" />
      </button>

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <SyncOptions
            syncMode={syncMode}
            setSyncMode={setSyncMode}
            selectedHtmlTag={htmlTag}
            setSelectedHtmlTag={setSelectedHtmlTag}
          />
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50 z-10"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  );
}

export default MenuDrawer;
