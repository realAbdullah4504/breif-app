import { useMutation} from '@tanstack/react-query';
import { ProfileService, UpdateProfileData } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const profileService = new ProfileService();

export const useProfile = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!currentUser) throw new Error('No user authenticated');
      return await profileService.updateProfile(currentUser.id, data);
    },
    onSuccess: (_, variables) => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, ...variables });
      }
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!currentUser) throw new Error('No user authenticated');
      return await profileService.uploadAvatar(currentUser.id, file);
    },
    onSuccess: ({ url }) => {
      if (currentUser && url) {
        setCurrentUser({ ...currentUser, avatar_url: url });
      }
      toast.success('Avatar updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar');
    }
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.avatar_url) throw new Error('No avatar to delete');
      return await profileService.deleteAvatar(currentUser.id, currentUser.avatar_url);
    },
    onSuccess: () => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, avatar_url: null });
      }
      toast.success('Avatar removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove avatar');
    }
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    deleteAvatar: deleteAvatarMutation.mutate,
    isUploading: uploadAvatarMutation.isPending || deleteAvatarMutation.isPending,
    isUpdating: updateProfileMutation.isPending
  };
};