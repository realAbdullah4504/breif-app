import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import Card, { CardHeader, CardBody, CardFooter } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Camera, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useProfile } from "../../hooks/useProfile";
import { UserAvatar } from "../../components/UI/UserAvatar";
import { motion, AnimatePresence } from "framer-motion";

// Common timezones for user selection
const userTimezones = [
  { value: '', label: 'Use workspace timezone (recommended)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKST)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

const Settings: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [accountSectionOpen, setAccountSectionOpen] = useState(true);
  const [notificationSectionOpen, setNotificationSectionOpen] = useState(false);
  const [dangerSectionOpen, setDangerSectionOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    timezone: currentUser?.timezone || "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    uploadAvatar,
    deleteAvatar,
    updateProfile,
    updatePassword,
    deleteAccount,
    isUploading,
    isUpdating: isUpdatingUser,
    isUpdatingPassword,
    isDeletingAccount,
  } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleUpdate = () => {
    const hasNameChange = profileData.name !== currentUser?.name;
    const hasTimezoneChange = profileData.timezone !== currentUser?.timezone;
    
    if (hasNameChange || hasTimezoneChange) {
      const updateData: any = {};
      if (hasNameChange) updateData.name = profileData.name;
      if (hasTimezoneChange) updateData.timezone = profileData.timezone || null;
      
      updateProfile(updateData);
    }
    
    if (profileData.password) {
      if (profileData.password !== profileData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      updatePassword({
        password: profileData.password,
        confirmPassword: profileData.confirmPassword,
      });
      setProfileData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    }
    if (avatar) {
      uploadAvatar(avatar);
      setAvatar(undefined);
      setAvatarPreview(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      deleteAccount();
      // The deleteAccount function will handle the success/error feedback
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal account settings and preferences.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
          {/* Account Settings Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setAccountSectionOpen(!accountSectionOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-medium text-gray-900">
                  Account Settings
                </h2>
                {accountSectionOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </CardHeader>
            <AnimatePresence>
              {accountSectionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <CardBody>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="relative">
                            <UserAvatar
                              src={avatarPreview || currentUser?.avatar_url}
                              name={currentUser?.name || "User"}
                              size="h-24 w-24"
                              className="ring-4 ring-white"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                              {currentUser?.avatar_url ? (
                                <button
                                  onClick={deleteAvatar}
                                  className="p-2 text-white hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-6 w-6" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="p-2 text-white hover:text-blue-500 transition-colors"
                                >
                                  <Camera className="h-6 w-6" />
                                </button>
                              )}
                            </div>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Click to {currentUser?.avatar_url ? "change" : "upload"} avatar
                        </p>
                      </div>

                      <div>
                        <Input
                          id="name"
                          label="Full name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Input
                          id="email"
                          label="Email address"
                          type="email"
                          disabled
                          value={currentUser?.email || ""}
                        />
                      </div>

                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone Preference
                        </label>
                        <select
                          id="timezone"
                          value={profileData.timezone}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              timezone: e.target.value,
                            }))
                          }
                          className="input py-3 px-4"
                        >
                          {userTimezones.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          Personal timezone preference. Leave blank to use workspace timezone.
                        </p>
                      </div>

                      <div className="relative">
                        <Input
                          id="password"
                          label="New password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={profileData.password}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-8 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          id="confirm-password"
                          label="Confirm password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={profileData.confirmPassword}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-8 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button
                      fullWidth
                      onClick={handleUpdate}
                      isLoading={isUploading || isUpdatingUser || isUpdatingPassword}
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Danger Zone Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setDangerSectionOpen(!dangerSectionOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-medium text-red-600">
                  Danger Zone
                </h2>
                {dangerSectionOpen ? (
                  <ChevronUp className="h-5 w-5 text-red-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-red-500" />
                )}
              </button>
            </CardHeader>
            <AnimatePresence>
              {dangerSectionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <CardBody>
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-red-800">
                            Delete Account
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              Once you delete your account, there is no going back. This action cannot be undone.
                              All your data, including briefs and settings, will be permanently deleted. If you need help, contact us at contact@brieflyapp.co.
                            </p>
                          </div>
                          
                          {!showDeleteConfirm ? (
                            <div className="mt-4">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(true)}
                              >
                                Delete Account
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-4 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-red-800 mb-2">
                                  Type "DELETE" to confirm:
                                </label>
                                <input
                                  type="text"
                                  value={deleteConfirmText}
                                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                                  className="input border-red-300 focus:ring-red-500 focus:border-red-500"
                                  placeholder="Type DELETE to confirm"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={handleDeleteAccount}
                                  isLoading={isDeletingAccount}
                                  disabled={deleteConfirmText !== 'DELETE'}
                                >
                                  Permanently Delete Account
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteConfirmText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          {/* Notification Preferences Section */}
          <Card>
            <CardHeader>
              <button
                onClick={() => setNotificationSectionOpen(!notificationSectionOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-medium text-gray-900">
                  Notification Preferences
                </h2>
                {notificationSectionOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </CardHeader>
            <AnimatePresence>
              {notificationSectionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <CardBody>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-gray-300 rounded transition-all duration-200"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Email notifications
                        </span>
                      </label>
                      <p className="mt-1 text-xs text-gray-500 ml-6">
                        Receive email notifications for reminders and updates.
                      </p>
                    </div>
                  </CardBody>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
    </DashboardLayout>
  );
};

export default Settings;