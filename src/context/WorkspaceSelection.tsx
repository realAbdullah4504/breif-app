import React, { createContext, useContext, useState, useEffect } from "react";

interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceContextType {
  selectedWorkspace: string;
  setSelectedWorkspace: (workspaceId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(() => {
    return localStorage.getItem("selectedWorkspace") || "";
  });

  useEffect(() => {
    if (selectedWorkspace) {
      localStorage.setItem("selectedWorkspace", selectedWorkspace);
    } else {
      localStorage.removeItem("selectedWorkspace");
    }
  }, [selectedWorkspace]);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceSelection = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceSelection must be used within a WorkspaceProvider");
  }
  return context;
};