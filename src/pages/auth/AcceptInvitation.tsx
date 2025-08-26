import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { AlertTriangle } from "lucide-react";

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const { acceptMemberWorkspaceInvitation } = useWorkspaces("");

  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      return;
    }

    acceptMemberWorkspaceInvitation(
      { token, email },
      {
        onSuccess: () => {
          setStatus("success");
          navigate("/login");
        },
        onError: () => {
          setStatus("error");
        },
      }
    );
  }, [acceptMemberWorkspaceInvitation, email, navigate, token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">Validating invitation link...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Invalid Invitation Link
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This link appears to be invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return null; // success handled by redirect
};

export default AcceptInvitation;
