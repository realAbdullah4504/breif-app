export interface Invitation {
  id: string;
  email: string;
  role:string;
  status: 'pending' | 'accepted';
  created_at: string;
}
export interface InvitationWithUser extends Invitation{
  user?: {
    name: string | null;
    avatar_url: string | null;
  }
}