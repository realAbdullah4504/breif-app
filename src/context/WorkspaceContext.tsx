import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { useWorkspaces } from "../hooks/useWorkspaces";

interface WorkspaceContextType {
  selectedWorkspaceId: string | null;
  setWorkspaceId: (workspaceId: string | null) => void;
  workspaceLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

// In WorkspaceContext.tsx
export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const { workspaces, isLoading } = useWorkspaces(currentUser?.id || "");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize workspace
  useEffect(() => {
    if (isLoading) return;

    const stored = localStorage.getItem("selectedWorkspaceId");
    const hasWorkspace = workspaces?.some(
      (workspace) => workspace.id === stored
    );

    if (stored && hasWorkspace) {
      setSelectedWorkspaceId(stored);
    } else if (workspaces?.length) {
      const newWorkspaceId = workspaces[0].id;
      setSelectedWorkspaceId(newWorkspaceId);
      localStorage.setItem("selectedWorkspaceId", newWorkspaceId);
    } else {
      setSelectedWorkspaceId(null);
    }

    setIsInitialized(true);
  }, [workspaces, isLoading]);

  const setWorkspaceId = useCallback((workspaceId: string | null) => {
    setSelectedWorkspaceId(workspaceId);
    if (workspaceId) {
      localStorage.setItem("selectedWorkspaceId", workspaceId);
    } else {
      localStorage.removeItem("selectedWorkspaceId");
    }
  }, []);

  const value = useMemo(
    () => ({
      selectedWorkspaceId,
      setWorkspaceId,
      workspaceLoading: !isInitialized || isLoading,
    }),
    [selectedWorkspaceId, setWorkspaceId, isInitialized, isLoading]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error(
      "useWorkspaceContext must be used within WorkspaceProvider"
    );
  return context;
};
