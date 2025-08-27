import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Building2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useWorkspaceSelection } from "../context/WorkspaceSelection";

const WorkspaceSelect: React.FC = () => {
  const { currentUser } = useAuth();
  const { workspaces, isLoading, error } = useWorkspaces(currentUser?.id || "");
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceSelection(workspaces?.[0]?.id || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectedWorkspaceData = workspaces?.find((w) => w.id === selectedWorkspace);

  // Get initial for workspace avatar
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  // Update dropdown position based on button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard accessibility
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center space-x-2 p-2 rounded-full bg-gray-50 w-full max-w-xs">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !workspaces || workspaces.length === 0) {
    return (
      <div className="p-2 text-center text-sm text-red-500 bg-red-50 rounded-full max-w-xs">
        {error ? "Error loading workspaces" : "No workspaces available"}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xs">
      <motion.button
        ref={buttonRef}
        onClick={() => {
          console.log("WorkspaceSelect button clicked, isOpen:", isOpen); // Debug
          setIsOpen(!isOpen);
        }}
        onKeyDown={handleKeyDown}
        className={`
          w-full flex items-center justify-between
          px-3 py-2 text-sm font-medium text-gray-900
          bg-white border border-indigo-400 rounded-full
          hover:bg-gray-50 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
          transition-all duration-200
          ${isOpen ? "ring-2 ring-indigo-500 ring-offset-1" : ""}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-label="Select workspace"
      >
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-semibold">
            {selectedWorkspaceData ? getInitial(selectedWorkspaceData.name) : <Building2 className="h-4 w-4" />}
          </div>
          <span className="truncate max-w-[150px]">{selectedWorkspaceData?.name || "Select a workspace"}</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
        </motion.span>
      </motion.button>

      {isOpen &&
        createPortal(
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[1000] bg-white border border-gray-200 rounded-xl shadow-lg overflow-visible"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {workspaces.map((workspace) => (
                <motion.div
                  key={workspace.id}
                  onClick={() => handleWorkspaceChange(workspace.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 text-sm cursor-pointer
                    ${selectedWorkspace === workspace.id
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                  role="option"
                  aria-selected={selectedWorkspace === workspace.id}
                >
                  <div
                    className={`
                      h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold
                      ${selectedWorkspace === workspace.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {getInitial(workspace.name)}
                  </div>
                  <span className="truncate">{workspace.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>,
          document.body
        )}
    </div>
  );
};

export default WorkspaceSelect;