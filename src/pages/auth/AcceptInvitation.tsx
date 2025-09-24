import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useWorkspaceInvitation } from "../../hooks/useWorkspaces";
import { AlertTriangle, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/UI/Button";
import { useTeamInvitations } from "../../hooks/useTeamInvitations";
import { SetPassword } from "./SetPassword";

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const { currentUser, logout, isLoading } = useAuth();
  const token = searchParams.get("token");
  const invitedEmail = searchParams.get("email");
  const navigate = useNavigate();
  const { acceptMemberWorkspaceInvitation, isAccepting } = useWorkspaceInvitation();
  const { verifyToken } = useTeamInvitations();

  const [status, setStatus] = useState<
    | "loading"
    | "error"
    | "wrong_user"
    | "no_user"
    | "existing_user"
    | "force_logout_for_signup"
  >("loading");

  const handleSignOut = async (type: "login" | "signup") => {
    await logout();
    if (type === "login") {
      navigate("/login", {
        state: {
          email: invitedEmail,
          fromInvite: true,
          inviteToken: token,
        },
      });
    }
    if (type === "signup") {
      navigate(
        "/auth/accept-invite?token=" +
          token +
          "&email=" +
          encodeURIComponent(invitedEmail || "")
      );
    }
  };

  useEffect(() => {
    if (!token || !invitedEmail) {
      setStatus("error");
      return;
    }
    if (isLoading) {
      return;
    }

    verifyToken(
      { token, email: invitedEmail },
      {
        onSuccess: (result) => {
          // Case 1: no such invited user exists (signup flow)
          if (result.status === "no_user") {
            // If *someone else* is logged in → force them to logout first
            if (
              currentUser &&
              currentUser.email?.toLowerCase() !== invitedEmail.toLowerCase()
            ) {
              setStatus("force_logout_for_signup");
              return;
            }

            setStatus("no_user");
            return;
          }

          // Case 2: invited user already exists
          if (result.status === "existing_user") {
            // No one logged in → prompt login
            if (!currentUser) {
              setStatus("existing_user");
              return;
            }

            // Wrong logged-in user
            if (
              currentUser.email?.toLowerCase() !== invitedEmail.toLowerCase()
            ) {
              setStatus("wrong_user");
              return;
            }

            // Correct user logged in → accept invitation
            acceptMemberWorkspaceInvitation(
              { token, email: invitedEmail },
              {
                onSuccess: () => {
                  navigate("/dashboard");
                },
                onError: () => setStatus("error"),
              }
            );
            return;
          }

          // fallback
          setStatus("error");
        },
        onError: () => {
          setStatus("error");
        },
      }
    );
  }, [
    token,
    invitedEmail,
    currentUser,
    isLoading,
    verifyToken,
    acceptMemberWorkspaceInvitation,
    navigate,
  ]);

  if (status === "loading" || isLoading || isAccepting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">Validating invitation link...</p>
      </div>
    );
  }

  if (status === "wrong_user" && currentUser && invitedEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded shadow">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Wrong Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This invite is for <b>{invitedEmail}</b>, but you’re logged in as{" "}
            <b>{currentUser.email}</b>.<br />
            Please sign out and log in with the invited account.
          </p>
          <Button
            className="mt-6"
            onClick={() => handleSignOut("login")}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }
  if (status === "existing_user") {
    // Show login UI with invitedEmail prefilled/locked
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">
            You’ve been invited to join as <b>{invitedEmail}</b>
          </h2>
          <p className="text-gray-600 mb-4">
            Please log in with this email to accept your invitation.
          </p>
          <Button
            onClick={() =>
              navigate("/login", {
                state: {
                  email: invitedEmail,
                  fromInvite: true,
                  inviteToken: token,
                },
              })
            }
            fullWidth
          >
            Log in as {invitedEmail}
          </Button>
        </div>
      </div>
    );
  }
  if (status === "force_logout_for_signup") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded shadow">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Wrong Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This invite is for <b>{invitedEmail}</b>, but you’re logged in as{" "}
            <b>{currentUser?.email}</b>.<br />
            Please sign out and create a new account with the invited email.
          </p>
          <Button
            className="mt-6"
            onClick={() => handleSignOut("signup")}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }
  if (status === "no_user") {
    return <SetPassword token={token} email={invitedEmail} />;
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
