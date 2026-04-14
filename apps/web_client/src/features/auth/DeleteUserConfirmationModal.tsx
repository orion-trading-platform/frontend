import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'ui-kit';
import { useAuth } from './AuthContext';
import { useAuthActions } from './useAuthActions';

interface DeleteUserConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserConfirmationModal: React.FC<DeleteUserConfirmationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { deleteUser } = useAuthActions();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteUser();
      await logout();
      onClose();
      navigate('/login');
    } catch {
      setError('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account" titleId="delete-user-modal-title">
      <p className="mt-0 mb-2 text-[15px] text-[#111827]">
        This will permanently delete your account and all associated data.
      </p>
      <p className="mt-0 mb-6 text-[13px] text-[#6B7280]">This action cannot be undone.</p>
      {error && (
        <p className="mt-0 mb-4 text-[13px] text-red-600" role="alert">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={deleting}
          className="flex-1 px-4 py-2.5 rounded-md border border-[#BCCCDC] text-sm font-medium bg-white text-[#111827] cursor-pointer hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={() => { void handleConfirm(); }}
          disabled={deleting}
          className="flex-1 px-4 py-2.5 rounded-md border-none text-sm font-medium text-white cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: '#dc2626' }}
        >
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteUserConfirmationModal;
