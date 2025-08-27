import React from "react";
import { useAuth } from "../context/AuthContext";
import { useWorkspaces } from "../hooks/useWorkspaces";

const WorkspaceSelect = () => {
  const { currentUser } = useAuth();
  const { workspaces, loading, error } = useWorkspaces(currentUser?.id || "");
  console.log("workspaces", workspaces);
  return (
    <div>
    </div>
  );
};

export default WorkspaceSelect;
