import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface WorkspaceContextType {
  selectedWorkspaceId: string | null;
  setWorkspaceId: (workspaceId: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("selectedWorkspaceId");
    if (stored) setSelectedWorkspaceId(stored);
  }, []);

  const setWorkspaceId = (workspaceId: string | null) => {
    setSelectedWorkspaceId(workspaceId);
    localStorage.setItem("selectedWorkspaceId", workspaceId || "");
  };

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspaceId, setWorkspaceId }}>
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
