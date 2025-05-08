import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar_url?: string | null;
}

export class ProfileService {
  async updateProfile(
    userId: string, 
    data: UpdateProfileData
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error as Error };
    }
  }

  async uploadAvatar(
    userId: string, 
    file: File
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

    //   if (file.size > 2 * 1024 * 1024) {
    //     throw new Error('Image must be smaller than 2MB');
    //   }

      // Upload file
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatar')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await this.updateProfile(userId, {
        avatar_url: data.publicUrl
      });

      if (updateError) throw updateError;

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { url: null, error: error as Error };
    }
  }

  async deleteAvatar(
    userId: string, 
    avatarUrl: string
  ): Promise<{ error: Error | null }> {
    try {
      // Extract file path from URL
      const filePath = avatarUrl.split('avatar/')[1];

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('avatar')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update profile
      const { error: updateError } = await this.updateProfile(userId, {
        avatar_url: null
      });

      if (updateError) throw updateError;

      return { error: null };
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return { error: error as Error };
    }
  }
}