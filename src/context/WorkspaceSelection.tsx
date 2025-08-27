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
    // Only set the workspace if it's not already set and we have workspaces
    if (!selectedWorkspace) {
      setSelectedWorkspace(workspaces?.[0]?.id || "");
    }
    
    // Only save to localStorage when selectedWorkspace changes and it's truthy
    if (selectedWorkspace) {
      localStorage.setItem("selectedWorkspace", selectedWorkspace);
    }
  }, [selectedWorkspace, workspaces]);

  return (
    <WorkspaceContext.Provider
      value={{ selectedWorkspace, setSelectedWorkspace, workspaces:workspaces || [] }}
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
