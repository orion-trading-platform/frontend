import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'ui-kit';
import api, { deleteAccount } from '../api';
import { AccountInfo } from '../useAccounts';
import { setSelectedAccountId } from '../useAccount';

interface AccountSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//NOTE: This isn't necessary with a single account in the final design and can be removed
const AccountSelectorModal: React.FC<AccountSelectorModalProps> = ({ isOpen, onClose }) => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const selectedId = localStorage.getItem('selectedAccountId');

  const fetchAccounts = () => {
    setIsLoading(true);
    setError('');
    api
      .get<AccountInfo[]>('/auth/me/accounts')
      .then((res) => setAccounts(res.data))
      .catch(() => setError('Failed to load accounts.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) fetchAccounts();
  }, [isOpen]);

  const handleSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    onClose();
  };

  const handleDelete = async (accountId: string) => {
    setDeletingId(accountId);
    setError('');
    try {
      await deleteAccount(accountId);
      fetchAccounts();
    } catch {
      setError('Failed to delete account. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const activeId = selectedId ?? (accounts[0] ? String(accounts[0].account_id) : null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Account" titleId="account-selector-modal-title">
      {isLoading ? (
        <p className="text-[15px] text-[#6B7280] dark:text-[#8892b0]">Loading accounts…</p>
      ) : accounts.length === 0 ? (
        <p className="text-[15px] text-[#6B7280] dark:text-[#8892b0]">No accounts found.</p>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {accounts.map((account) => {
            const isActive = String(account.account_id) === activeId;
            const balance = parseFloat(account.balance).toLocaleString('en-US', {
              style: 'currency',
              currency: account.currency ?? 'USD',
            });
            return (
              <div
                key={account.account_id}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-[#BCCCDC] dark:border-[#2d2f50]'
                }`}
              >
                <div>
                  <p className="text-[14px] font-medium text-[#111827] dark:text-[#e2e8f0]">
                    {isActive && <span className="mr-1">✓</span>}
                    Account {account.account_id}
                  </p>
                  <p className="text-[13px] text-[#6B7280] dark:text-[#8892b0]">{balance}</p>
                </div>
                <div className="flex gap-2">
                  {!isActive && (
                    <Button
                      variant="primary"
                      onClick={() => handleSelect(String(account.account_id))}
                      className="text-[13px] py-1 px-3"
                    >
                      Select
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() => { void handleDelete(String(account.account_id)); }}
                    disabled={accounts.length === 1 || deletingId === account.account_id}
                    className="text-[13px] py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === account.account_id ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {error && (
        <p className="mt-0 mb-3 text-[13px] text-red-600" role="alert">{error}</p>
      )}
      <Button variant="ghost" onClick={onClose} className="w-full">
        Close
      </Button>
    </Modal>
  );
};

export default AccountSelectorModal;
