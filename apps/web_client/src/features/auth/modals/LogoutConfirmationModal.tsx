import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'ui-kit';
import { useAuth } from '../AuthContext';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirm = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Out" titleId="logout-modal-title">
      <p className="mt-0 mb-6 text-[15px] text-[#111827]">Are you sure you want to log out?</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-md border border-[#BCCCDC] text-sm font-medium bg-white text-[#111827] cursor-pointer hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => { void handleConfirm(); }}
          className="flex-1 px-4 py-2.5 rounded-md border-none text-sm font-medium text-white cursor-pointer"
          style={{ background: 'rgb(94, 111, 161)' }}
        >
          Log Out
        </button>
      </div>
    </Modal>
  );
};

export default LogoutConfirmationModal;
