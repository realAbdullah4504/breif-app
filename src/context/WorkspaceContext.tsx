import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
interface WorkspaceContextType {
  selectedWorkspaceId: string | null;
  setWorkspaceId: (workspaceId: string | null) => void;
  setInitialWorkspaceId: (workspaces: any) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

// In WorkspaceContext.tsx
export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  const setInitialWorkspaceId = useCallback((workspaces: any) => {
    const stored = localStorage.getItem("selectedWorkspaceId");
    const hasWorkspace = workspaces?.some(
      (workspace: any) => workspace.id === stored
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
  }, []);

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
      setInitialWorkspaceId,
    }),
    [selectedWorkspaceId, setWorkspaceId, setInitialWorkspaceId]
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
