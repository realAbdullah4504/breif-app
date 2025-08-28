import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useWorkspaces } from "../hooks/useWorkspaces";



type WorkspacesType={
  id: string;
  name: string;
}
interface WorkspaceContextType {
  selectedWorkspace: string;
  setSelectedWorkspace: (workspaceId: string) => void;
  workspaces: WorkspacesType[];
  isLoadingWorkspaces: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {currentUser}=useAuth()
  const {workspaces,isLoading: isLoadingWorkspaces}=useWorkspaces(currentUser?.id || "");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>();

  useEffect(() => {
    const stored = localStorage.getItem("selectedWorkspace");
  
    // If the stored workspace is no longer in the fetched workspaces → clear it
    const stillExists = workspaces?.some(ws => ws.id === stored);
  
    if (!stillExists) {
      // reset to first available workspace OR clear
      const newWorkspace = workspaces?.[0]?.id || "";
      setSelectedWorkspace(newWorkspace);
  
      if (newWorkspace) {
        localStorage.setItem("selectedWorkspace", newWorkspace);
      } else {
        localStorage.removeItem("selectedWorkspace");
      }
    }
  }, [workspaces]);
  

  return (
    <WorkspaceContext.Provider
      value={{ selectedWorkspace, setSelectedWorkspace, workspaces:workspaces || [],isLoadingWorkspaces}}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceSelection = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useWorkspaceSelection must be used within a WorkspaceProvider"
    );
  }
  return context;
};
