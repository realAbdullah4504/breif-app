import React, { useState } from 'react';
import { format } from 'date-fns';
import { UserPlus, Mail, Trash2, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import { mockInvitations, mockUsers } from '../../data/mockData';
import { Invitation } from '../../types';

const TeamManagement: React.FC = () => {
  const [email, setEmail] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Check if email is already invited
    if (invitations.some(invite => invite.email === email)) {
      setError('This email has already been invited');
      return;
    }
    
    setIsInviting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newInvitation: Invitation = {
        id: `inv-${Date.now()}`,
        email,
        status: 'pending',
        date: format(new Date(), 'yyyy-MM-dd')
      };
      
      setInvitations([newInvitation, ...invitations]);
      setEmail('');
      setIsInviting(false);
    }, 1000);
  };

  const handleDeleteInvitation = (id: string) => {
    setInvitations(invitations.filter(invite => invite.id !== id));
  };

  const handleResendInvitation = (id: string) => {
    // Simulate resending invitation
    setTimeout(() => {
      // In a real app, this would call an API
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Invite team members and manage your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Team Members</h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="success">Active</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Invite Team Members</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleInvite}>
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-3">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <Input
                    id="email"
                    type="email"
                    label="Email address"
                    placeholder="colleague@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isInviting}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </form>
            </CardBody>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Pending Invitations</h2>
              </CardHeader>
              <CardBody className="p-0">
                {invitations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No pending invitations
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{invitation.email}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              Invited on {format(new Date(invitation.date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="flex">
                            {invitation.status === 'pending' ? (
                              <>
                                <button
                                  type="button"
                                  className="text-gray-400 hover:text-gray-500 mr-2"
                                  onClick={() => handleResendInvitation(invitation.id)}
                                >
                                  <Mail className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="text-gray-400 hover:text-red-500"
                                  onClick={() => handleDeleteInvitation(invitation.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <Badge variant="success" className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accepted
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge
                            variant={invitation.status === 'pending' ? 'warning' : 'success'}
                            className="flex items-center w-fit"
                          >
                            {invitation.status === 'pending' ? (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Pending
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accepted
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;