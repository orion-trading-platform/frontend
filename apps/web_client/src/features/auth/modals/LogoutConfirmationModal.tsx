import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'ui-kit';
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
      <p className="mt-3 mb-6 text-[15px] text-[#111827] dark:text-[#e2e8f0]">Are you sure you want to log out?</p>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" onClick={() => { void handleConfirm(); }} className="flex-1">
          Log Out
        </Button>
      </div>
    </Modal>
  );
};

export default LogoutConfirmationModal;
