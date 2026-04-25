import { useCallback, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useTheme } from "@/ThemeContext";
import { useNavigate } from "react-router-dom";
import { MdLogout, MdDarkMode, MdLightMode } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { Header, Button } from "ui-kit";
import ProfileModal from "@/features/auth/modals/ProfileModal";
import LogoutConfirmationModal from "@/features/auth/modals/LogoutConfirmationModal";
import { useAccount, emitAccountsRefresh } from "@/features/auth";
import { WalletHeaderNavButton } from "../components/WalletHeaderNavButton";
import { LedgerHeaderNavButton } from "@/features/ledger/LedgerHeaderNavButon";
import {
  postAccountDeposit,
  formatAccountBalanceError,
} from "../api/accountBalance";
import {
  accountBalanceToNumber,
  centsToDecimalString,
  formatUsdCash,
  MAX_SINGLE_DEPOSIT_USD,
  parseDepositDollarsToCents,
} from "../utils/accountCash";
import logoWhite from "@/assets/logo-white.svg";
import orionTextWhite from "@/assets/orion-text-white.svg";

export default function WalletPage() {
  const navigate = useNavigate();
  const { account, isLoading: accountLoading } = useAccount();
  const { dark, toggleDark } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [depositInput, setDepositInput] = useState("");
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositFeedback, setDepositFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const balanceNum = useMemo(() => {
    if (!account) return 0;
    return accountBalanceToNumber(account.balance);
  }, [account]);

  const formattedBalance = useMemo(
    () => formatUsdCash(balanceNum, account?.currency ?? "USD"),
    [balanceNum, account?.currency]
  );

  const clearDepositFeedback = useCallback(() => setDepositFeedback(null), []);

  const submitDeposit = async () => {
    clearDepositFeedback();
    if (!account) return;

    const parsed = parseDepositDollarsToCents(depositInput);
    if (!parsed.ok) {
      setDepositFeedback({ kind: "err", text: parsed.reason });
      return;
    }

    const depositDollars = parsed.cents / 100;
    if (depositDollars > MAX_SINGLE_DEPOSIT_USD) {
      setDepositFeedback({
        kind: "err",
        text: `For safety, each deposit is limited to ${formatUsdCash(MAX_SINGLE_DEPOSIT_USD)}. Enter a smaller amount or split into multiple deposits.`,
      });
      return;
    }

    const amountStr = centsToDecimalString(parsed.cents);

    setDepositBusy(true);
    try {
      await postAccountDeposit(account.account_id, amountStr);
      setDepositInput("");
      setDepositFeedback({ kind: "ok", text: "Deposit completed." });
      emitAccountsRefresh();
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 409) {
        emitAccountsRefresh();
        setDepositFeedback({
          kind: "err",
          text: "Deposit conflicted with another update. Your balance was refreshed — try again.",
        });
      } else {
        setDepositFeedback({ kind: "err", text: formatAccountBalanceError(e) });
      }
    } finally {
      setDepositBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0D0D14]">
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <LogoutConfirmationModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      <Header
        left={
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
          >
            <img src={logoWhite} alt="" style={{ height: "47px", width: "auto" }} className="brightness-0 dark:brightness-100" />
            <img src={orionTextWhite} alt="Orion" style={{ height: "29px", width: "auto" }} className="brightness-0 dark:brightness-100" />
          </button>
        }
        right={
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
              <button
                type="button"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleDark}
                style={{ background: "none", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "var(--header-icon-color)", flexShrink: 0 }}
              >
                {dark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
              </button>
              <WalletHeaderNavButton />
              <LedgerHeaderNavButton />
              <button
                type="button"
                aria-label="Profile"
                onClick={() => setProfileOpen(true)}
                style={{ background: "none", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "var(--header-icon-color)", flexShrink: 0 }}
              >
                <FaUserAlt size={21} />
              </button>
              <button
                type="button"
                aria-label="Logout"
                onClick={() => setLogoutOpen(true)}
                style={{ background: "none", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "var(--header-icon-color)", flexShrink: 0 }}
              >
                <MdLogout size={22} />
              </button>
            </div>
          </div>
        }
      />

      <main className="mx-auto max-w-xl p-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 border-0 bg-transparent p-0 text-sm text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Return to home
        </button>

        <div className="mb-8 min-w-0 max-w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-[#2d2f50] dark:bg-[#141628]">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-[#8892b0]">Available balance</p>
          {accountLoading && !account ? (
            <p className="text-lg text-gray-500">Loading…</p>
          ) : (
            <p
              className="break-words text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-4xl dark:text-[#e2e8f0]"
              title={formattedBalance}
            >
              <span className="inline-block max-w-full">{formattedBalance}</span>
              {account && account.currency && account.currency !== "USD" ? (
                <span className="ml-2 text-base font-medium text-gray-500 dark:text-[#8892b0] sm:text-lg">{account.currency}</span>
              ) : null}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#2d2f50] dark:bg-[#141628]">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-[#e2e8f0]">Deposit</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-[#8892b0]">Add funds to your cash balance. Deposits appear on your account ledger.</p>
            <label htmlFor="wallet-deposit" className="sr-only">
              Deposit amount
            </label>
            <input
              id="wallet-deposit"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="Amount (e.g. 100.00)"
              value={depositInput}
              onChange={(e) => {
                clearDepositFeedback();
                setDepositInput(e.target.value);
              }}
              disabled={!account || depositBusy}
              className="mb-3 w-full min-w-0 rounded-md border border-[#BCCCDC] px-3 py-2 text-sm text-gray-900 outline-none disabled:opacity-60 dark:border-[#2d2f50] dark:bg-[#0D0D14] dark:text-[#e2e8f0]"
            />
            {depositFeedback && (
              <p className={`mb-3 text-sm ${depositFeedback.kind === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} role={depositFeedback.kind === "err" ? "alert" : "status"}>
                {depositFeedback.text}
              </p>
            )}
            <Button variant="primary" onClick={() => void submitDeposit()} disabled={!account || depositBusy} className="w-full disabled:cursor-not-allowed disabled:opacity-70">
              {depositBusy ? "Processing…" : "Deposit"}
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
