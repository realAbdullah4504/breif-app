import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { InviteService } from "../services/inviteService";
import { queryClient } from "../lib/queryClient";
import { ExtendedUser } from "../services/auth";

const inviteService = new InviteService();

export const useTeamInvitations = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const invitationsQuery = useQuery({
    queryKey: ["invitations", currentUser?.id],
    queryFn: () =>
      currentUser
        ? inviteService.getInvitations(currentUser.id)
        : Promise.reject(new Error("User is not authenticated")),
    refetchOnWindowFocus: false,
  });

  const sendInviteMutation = useMutation({
    mutationFn: async (email: string) => {
      if (!currentUser?.id) {
        throw new Error("User ID is undefined");
      }
      const response = await inviteService.createInvite(
        email,
        "member",
        currentUser.id
      );
      return { ...response, email }; // Include email in the response for context
    },
    onMutate: async (email) => {
      await queryClient.cancelQueries({
        queryKey: ["invitations", currentUser?.id],
      });

      const tempId = `temp-${Date.now()}`;
      const optimisticUpdate = {
        id: tempId,
        email,
        status: "pending",
        invited_by: currentUser!.id,
        user: null,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ["invitations", currentUser?.id],
        (oldData: any) => {
          if (!oldData) return { data: [optimisticUpdate], error: null };
          return {
            ...oldData,
            data: oldData.data
              .filter((inv: any) => inv.email !== email)
              .concat(optimisticUpdate),
          };
        }
      );

      return { optimisticUpdate, email, tempId };
    },
    onSuccess: (response, _email, context) => {
      if (!context?.optimisticUpdate) return;

      // Update the cache with the server response
      queryClient.setQueryData(
        ["invitations", currentUser?.id],
        (oldData: any) => {
          if (!oldData) return { data: [] };

          return {
            ...oldData,
            data: oldData.data.map((inv: any) =>
              inv.id === context.tempId
                ? { ...response.data, email: context.email } // Replace with server data
                : inv
            ),
          };
        }
      );
    },
    onError: (error, _email, context) => {
      console.error("Error sending invite:", error);

      // Rollback: remove the optimistic invite
      if (context?.optimisticUpdate) {
        queryClient.setQueryData(
          ["invitations", currentUser?.id],
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.filter(
                (inv: any) => inv.id !== context.optimisticUpdate.id
              ),
            };
          }
        );
      }
    },
  });

  const verifyTokenMutation = useMutation({
    mutationFn: async ({ token, email }: { token: string; email: string }) => {
      return inviteService.verifyToken(token, email);
    },
  });
  const deleteInvite = useMutation({
    mutationFn: async (id: string) => {
      if (!currentUser?.id) throw new Error("User ID is undefined");
      return inviteService.deleteInvitation(id, currentUser.id);
    },
    onMutate: async (id: string) => {
      queryClient.setQueryData(
        ["invitations", currentUser?.id],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((i: any) => i.id !== id),
          };
        }
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["invitations", currentUser?.id],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((i: any) => i.id !== data.id),
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error deleting invite:", error);
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: ({
      token,
      email,
      username,
      password,
    }: {
      token: string;
      email: string;
      username: string;
      password: string;
    }) => {
      return inviteService.setPassword(token, email, username, password);
    },
    onSuccess: (user: ExtendedUser) => {
      setCurrentUser(user);
    },
    onError: (error) => {
      console.error("Error setting password:", error);
    },
  });

  return {
    invitations: invitationsQuery?.data?.data || [],
    isLoading: invitationsQuery.isLoading,
    isError: invitationsQuery.isError,

    sendInvite: sendInviteMutation.mutate,
    isInviting: sendInviteMutation.isPending,

    verifyToken: verifyTokenMutation.mutate,
    isVerifyingToken: verifyTokenMutation.isPending,

    setPassword: setPasswordMutation.mutate,
    isSettingPassword: setPasswordMutation.isPending,

    deleteInvite: (id: string) => deleteInvite.mutate(id),
    isDeleting: deleteInvite.isPending,
  };
};
