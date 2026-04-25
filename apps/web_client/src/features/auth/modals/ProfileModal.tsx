import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'ui-kit';
import { useAuth } from '../AuthContext';
import { useAuthActions } from '../useAuthActions';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import DeleteUserConfirmationModal from './DeleteUserConfirmationModal';
// import AccountSelectorModal from './AccountSelectorModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { changePassword, setPassword } = useAuthActions();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [setPassNewPassword, setSetPassNewPassword] = useState('');
  const [setPassError, setSetPassError] = useState('');
  const [setPassMessage, setSetPassMessage] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [justSetPassword, setJustSetPassword] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordMessage('');
    setSetPassNewPassword('');
    setSetPassError('');
    setSetPassMessage('');
    setJustSetPassword(false);
  }, [isOpen]);

  const handleSetPassword = async () => {
    setSetPassError('');
    setSetPassMessage('');
    if (setPassNewPassword.length < 8) {
      setSetPassError('Password must be at least 8 characters.');
      return;
    }
    setSettingPassword(true);
    try {
      await setPassword(setPassNewPassword);
      setSetPassMessage('Password set successfully! You can now log in with email and password.');
      setSetPassNewPassword('');
      setTimeout(() => { setJustSetPassword(true); setSetPassMessage(''); }, 1500);
    } catch {
      setSetPassError('Failed to set password. Please try again.');
    } finally {
      setSettingPassword(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordMessage('');
    if (!currentPassword) { setPasswordError('Current password is required.'); return; }
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage('Password changed successfully.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch {
      setPasswordError('Failed to change password. Check your current password and try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const memberSince = currentUser?.created_at
    ? new Date(currentUser.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  const showSetPassword = currentUser?.has_password === false && !justSetPassword;

  return (
    <>
      <Modal isOpen={isOpen && !showLogoutModal && !showDeleteModal && !showAccountModal} onClose={onClose} title="Profile" titleId="profile-modal-title">

        {/* User info */}
        <div className="bg-slate-50 dark:bg-[#141628] border border-[#BCCCDC] dark:border-[#2d2f50] rounded-lg px-[18px] py-4 mb-6">
          <div className="mb-2.5">
            <span className="text-xs text-[#6B7280] dark:text-[#8892b0] uppercase tracking-[0.05em]">Email</span>
            <p className="mt-1 mb-0 text-[15px] text-[#111827] dark:text-[#e2e8f0] font-medium">
              {currentUser?.email ?? '—'}
            </p>
          </div>
          <div>
            <span className="text-xs text-[#6B7280] dark:text-[#8892b0] uppercase tracking-[0.05em]">Member since</span>
            <p className="mt-1 mb-0 text-[15px] text-[#111827] dark:text-[#e2e8f0] font-medium">{memberSince}</p>
          </div>
        </div>

        {showSetPassword ? (
          <div className="mb-6">
            <h3 className="mt-0 mb-[6px] text-[15px] font-semibold text-[#111827] dark:text-[#e2e8f0]">Set Password</h3>
            <p className="mt-0 mb-[14px] text-[13px] text-[#6B7280] dark:text-[#8892b0]">
              Add email/password login to your account.
            </p>
            <div className="flex flex-col gap-[10px]">
              <input
                type="email"
                value={currentUser?.email ?? ''}
                readOnly
                aria-label="Account email address"
                aria-readonly="true"
                className="w-full px-3 py-[9px] border border-[#BCCCDC] dark:border-[#2d2f50] rounded-md text-sm text-[#6B7280] dark:text-[#8892b0] outline-none box-border bg-slate-50 dark:bg-[#141628] cursor-default"
              />
              <input
                type="password"
                placeholder="New password (min 8 characters)"
                value={setPassNewPassword}
                onChange={(e) => setSetPassNewPassword(e.target.value)}
                aria-label="New password"
                className="w-full px-3 py-[9px] border border-[#BCCCDC] dark:border-[#2d2f50] rounded-md text-sm text-[#111827] dark:text-[#e2e8f0] outline-none box-border dark:bg-[#141628]"
              />
            </div>
            {setPassError && (
              <p className="mt-2 mb-0 text-[13px] text-red-600" role="alert">{setPassError}</p>
            )}
            {setPassMessage && (
              <p className="mt-2 mb-0 text-[13px] text-green-600" role="status">{setPassMessage}</p>
            )}
            <Button
              variant="primary"
              onClick={() => { void handleSetPassword(); }}
              disabled={settingPassword}
              className="w-full mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {settingPassword ? 'Setting...' : 'Set Password'}
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="mt-0 mb-[14px] text-[15px] font-semibold text-[#111827] dark:text-[#e2e8f0]">Change Password</h3>
            <div className="flex flex-col gap-[10px]">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                aria-label="Current password"
                className="w-full px-3 py-[9px] border border-[#BCCCDC] dark:border-[#2d2f50] rounded-md text-sm text-[#111827] dark:text-[#e2e8f0] outline-none box-border dark:bg-[#141628]"
              />
              <input
                type="password"
                placeholder="New password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-label="New password"
                className="w-full px-3 py-[9px] border border-[#BCCCDC] dark:border-[#2d2f50] rounded-md text-sm text-[#111827] dark:text-[#e2e8f0] outline-none box-border dark:bg-[#141628]"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm new password"
                className="w-full px-3 py-[9px] border border-[#BCCCDC] dark:border-[#2d2f50] rounded-md text-sm text-[#111827] dark:text-[#e2e8f0] outline-none box-border dark:bg-[#141628]"
              />
            </div>
            {passwordError && (
              <p className="mt-2 mb-0 text-[13px] text-red-600" role="alert">{passwordError}</p>
            )}
            {passwordMessage && (
              <p className="mt-2 mb-0 text-[13px] text-green-600" role="status">{passwordMessage}</p>
            )}
            <Button
              variant="primary"
              onClick={() => { void handleChangePassword(); }}
              disabled={changingPassword}
              className="w-full mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        )}

        {/* Account actions */}
        <div className="border-t border-[#BCCCDC] dark:border-[#2d2f50] pt-5 flex flex-col gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteModal(true)} className="w-full">
            Delete User
          </Button>
          {/* NOTE: This isn't necessary with a single account in the final design and can be removed */}
          {/* <Button variant="ghost" onClick={() => setShowAccountModal(true)} className="w-full">
            Select Account
          </Button> */}
          <Button variant="ghost" onClick={() => setShowLogoutModal(true)} className="w-full">
            Log Out
          </Button>
        </div>

      </Modal>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
      <DeleteUserConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
      {/* <AccountSelectorModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      /> */}
    </>
  );
};

export default ProfileModal;
