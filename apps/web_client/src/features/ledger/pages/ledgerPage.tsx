import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from '@/ThemeContext';
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';
import { Header } from 'ui-kit';
import { useNavigate } from "react-router-dom";
import { MdLogout, MdDarkMode, MdLightMode } from "react-icons/md";
import { TickerSearch } from "@/features/dashboard/components/TickerSearch";
import { useAuth, useAccount, useAccounts, api } from "@/features/auth";
import ProfileModal from "@/features/auth/modals/ProfileModal";
import LogoutConfirmationModal from "@/features/auth/modals/LogoutConfirmationModal";
import {
  ledgerService,
  type ActivityItem,
  type ActivityDetail,
  type LedgerSummary,
} from "../services/ledgerService";


const formatMoney = (n: number | null | undefined): string => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "--";
  const sign = Number(n) < 0 ? "-" : "";
  const abs = Math.abs(Number(n));
  return `${sign}$${abs.toFixed(2)}`;
};

const formatNumber = (n: number | null | undefined): string => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "--";
  return Number(n).toLocaleString();
};

const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "--";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};



const pillClass = (status: string | undefined): string => {
  const s = (status || "").toUpperCase();
  if (s === "FILLED" || s === "COMPLETED")
    return "bg-[rgba(0,200,5,0.12)] text-[#00c805] border border-[rgba(0,200,5,0.18)]";
  if (s === "PENDING")
    return "bg-[rgba(245,158,11,0.12)] text-amber-600 dark:text-amber-300 border border-[rgba(245,158,11,0.18)]";
  if (s === "CANCELLED")
    return "bg-[rgba(148,163,184,0.10)] text-slate-500 dark:text-slate-300 border border-[rgba(148,163,184,0.18)]";
  if (s === "FAILED")
    return "bg-[rgba(239,68,68,0.12)] text-red-500 dark:text-red-300 border border-[rgba(239,68,68,0.18)]";
  return "bg-[rgba(148,163,184,0.10)] text-slate-500 dark:text-slate-300 border border-[rgba(148,163,184,0.18)]";
};

const typeBadge = (type: string | undefined, subtype: string | null | undefined): { label: string; cls: string } => {
  const t = (type || "").toUpperCase();
  const st = (subtype || "").toUpperCase();

  if (t === "TRADE") {
    if (st === "BUY")
      return { label: "BUY", cls: "bg-[rgba(0,200,5,0.12)] text-[#00c805] border border-[rgba(0,200,5,0.18)]" };
    if (st === "SELL")
      return { label: "SELL", cls: "bg-[rgba(99,102,241,0.12)] text-indigo-500 dark:text-indigo-300 border border-[rgba(99,102,241,0.18)]" };
    return { label: "TRADE", cls: "bg-[rgba(148,163,184,0.10)] text-slate-500 dark:text-slate-300 border border-[rgba(148,163,184,0.18)]" };
  }

  if (t === "TRANSFER") {
    if (st === "DEPOSIT")
      return { label: "DEPOSIT", cls: "bg-[rgba(34,197,94,0.10)] text-green-600 dark:text-green-300 border border-[rgba(34,197,94,0.18)]" };
    if (st === "WITHDRAW" || st === "WITHDRAWAL")
      return { label: "WITHDRAW", cls: "bg-[rgba(249,115,22,0.12)] text-orange-500 dark:text-orange-300 border border-[rgba(249,115,22,0.18)]" };
    return { label: "TRANSFER", cls: "bg-[rgba(148,163,184,0.10)] text-slate-500 dark:text-slate-300 border border-[rgba(148,163,184,0.18)]" };
  }

  if (t === "DIVIDEND")
    return { label: "DIVIDEND", cls: "bg-[rgba(20,184,166,0.12)] text-teal-600 dark:text-teal-300 border border-[rgba(20,184,166,0.18)]" };
  if (t === "FEE")
    return { label: "FEE", cls: "bg-[rgba(244,63,94,0.12)] text-rose-500 dark:text-rose-300 border border-[rgba(244,63,94,0.18)]" };
  if (t === "INTEREST")
    return { label: "INTEREST", cls: "bg-[rgba(168,85,247,0.12)] text-purple-500 dark:text-purple-300 border border-[rgba(168,85,247,0.18)]" };

  return { label: type || "EVENT", cls: "bg-[rgba(148,163,184,0.10)] text-slate-500 dark:text-slate-300 border border-[rgba(148,163,184,0.18)]" };
};


function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-[rgba(148,163,184,0.10)] bg-white dark:bg-[#0f1520] shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ${className}`}
    >
      {children}
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Panel className="p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </Panel>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#5B6AD4] text-black"
          : "bg-white dark:bg-[#0f1520] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[rgba(148,163,184,0.14)] hover:bg-slate-50 dark:hover:bg-[#121b2a]"
      }`}
    >
      {label}
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[rgba(148,163,184,0.12)] bg-slate-50 dark:bg-[#0b111b] p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100 break-words">{String(value)}</div>
    </div>
  );
}


interface DetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  detail: ActivityDetail | null;
  drawerError: string;
}

function DetailsDrawer({ open, onClose, loading, detail, drawerError }: DetailsDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      role="dialog"
      aria-modal={open}
      aria-label="Activity details"
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white dark:bg-[#0D0D14] shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[rgba(148,163,184,0.12)] p-4">
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">Activity Details</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {detail?.timestamp ? formatDateTime(detail.timestamp) : "—"}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] bg-slate-50 dark:bg-[#0f1520] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#121b2a]"
          >
            Close
          </button>
        </div>

        <div className="p-4">
          {drawerError ? (
            <div className="rounded-2xl border border-[rgba(239,68,68,0.24)] bg-[rgba(239,68,68,0.12)] p-4 text-sm text-red-600 dark:text-red-200">
              {drawerError}
            </div>
          ) : loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-[rgba(148,163,184,0.10)]" />
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-[rgba(148,163,184,0.10)]" />
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-[rgba(148,163,184,0.10)]" />
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-[rgba(148,163,184,0.10)]" />
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-[rgba(148,163,184,0.10)]" />
            </div>
          ) : detail ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Info label="Type" value={`${detail.type || "--"}${detail.subtype ? ` / ${detail.subtype}` : ""}`} />
                <Info label="Status" value={detail.status || "--"} />
                <Info label="Symbol" value={detail.symbol || "--"} />
                <Info label="Quantity" value={detail.quantity != null ? String(detail.quantity) : "--"} />
                <Info label="Price" value={detail.price != null ? `$${Number(detail.price).toFixed(2)}` : "--"} />
                <Info label="Fee" value={detail.fee != null ? formatMoney(detail.fee) : "--"} />
                <Info label="Amount" value={detail.amount != null ? formatMoney(detail.amount) : "--"} />
                <Info label="Order ID" value={detail.orderId || "--"} />
                <Info label="Transfer ID" value={detail.transferId || "--"} />
                <Info label="Order Type" value={detail.orderType || "--"} />
              </div>

              {detail.notes ? (
                <div className="rounded-2xl border border-slate-200 dark:border-[rgba(148,163,184,0.12)] bg-slate-50 dark:bg-[#0f1520] p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Notes</div>
                  <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{detail.notes}</div>
                </div>
              ) : null}

              {detail.failureReason ? (
                <div className="rounded-2xl border border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.10)] p-3">
                  <div className="text-[11px] uppercase tracking-wide text-red-500 dark:text-red-300">Failure Reason</div>
                  <div className="mt-1 text-sm text-red-600 dark:text-red-200">{detail.failureReason}</div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-300">No details loaded.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{children}</div>;
}

function BaseInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={`mt-1 w-full rounded-xl border border-slate-300 dark:border-[rgba(148,163,184,0.16)] bg-white dark:bg-[#0b111b] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[rgba(0,200,5,0.55)] focus:ring-2 focus:ring-[rgba(0,200,5,0.20)] ${className}`}
    />
  );
}

function BaseSelect({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string; children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`mt-1 w-full rounded-xl border border-slate-300 dark:border-[rgba(148,163,184,0.16)] bg-white dark:bg-[#0b111b] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-[rgba(0,200,5,0.55)] focus:ring-2 focus:ring-[rgba(0,200,5,0.20)] ${className}`}
    >
      {children}
    </select>
  );
}

interface FilterInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

function FilterInput({ label, value, onChange, placeholder, className = "" }: FilterInputProps) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <BaseInput value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

interface FilterDateProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  className?: string;
}

function FilterDate({ label, value, onChange, disabled, className = "" }: FilterDateProps) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <BaseInput
        type="date"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="disabled:opacity-50"
      />
    </div>
  );
}

interface FilterSelectOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: FilterSelectOption[];
  className?: string;
}

function FilterSelect({ label, value, onChange, options, className = "" }: FilterSelectProps) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <BaseSelect value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white dark:bg-[#0b111b]">
            {o.label}
          </option>
        ))}
      </BaseSelect>
    </div>
  );
}

const DEFAULT_PAGE_SIZE = 25;

export default function LedgerPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tickerQuery, setTickerQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { dark, toggleDark } = useTheme();

  // Filters
  const [dateRange, setDateRange] = useState("7D");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [symbol, setSymbol] = useState("");

  // Tabs
  const [tab, setTab] = useState("ALL");

  // Data
  const [summary, setSummary] = useState<LedgerSummary | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);

  // Loading/Error
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [error, setError] = useState("");

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<ActivityDetail | null>(null);
  const [drawerError, setDrawerError] = useState("");

  const { startDate, endDate } = useMemo(() => {
    // Build a local-time window so the backend filter matches the dates users
    // see in the table (timestamps render in local time). Send full ISO-8601
    // so servers compare instants directly and there is no UTC-date rounding.
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    const parseYmdLocal = (s: string): Date | null => {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
      if (!m) return null;
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    };

    if (dateRange === "TODAY") {
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === "7D") {
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === "1M") {
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === "YTD") {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (dateRange === "CUSTOM") {
      if (customStart) {
        const parsed = parseYmdLocal(customStart);
        if (parsed) start = parsed;
      } else {
        start.setHours(0, 0, 0, 0);
      }
      if (customEnd) {
        const parsed = parseYmdLocal(customEnd);
        if (parsed) end = parsed;
      }
    }

    end.setHours(23, 59, 59, 999);

    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }, [dateRange, customStart, customEnd]);

  const effectiveType = useMemo(() => {
    if (type !== "ALL") return type;
    if (tab === "TRADES") return "TRADE";
    if (tab === "TRANSFERS") return "TRANSFER";
    if (tab === "DIVIDENDS") return "DIVIDEND";
    if (tab === "FEES") return "FEE";
    return "ALL";
  }, [tab, type]);

  useEffect(() => {
    setPage(1);
  }, [dateRange, customStart, customEnd, tab, type, status, symbol]);

  function computeSummary(items: ActivityItem[]): LedgerSummary {
    let realizedPL = 0;
    let cashBalance = 0;

    for (const item of items) {
      const amt = Number(item.amount) || 0;
      const fee = Number(item.fee) || 0;

      if (item.type === "TRADE") {
        realizedPL += amt - fee;
      }
      cashBalance += amt - fee;
    }

    return {
      netPL: realizedPL, // unrealizedPL is 0 — needs market prices
      realizedPL,
      unrealizedPL: 0,
      cashBalance,
      accountValue: 0,
      buyingPower: 0,
    };
  }

  async function fetchActivity() {
    setLoadingActivity(true);
    setLoadingSummary(true);
    setError("");
    try {
      // Fetch all activity (unfiltered by type/status/symbol) for summary computation
      const allData = await ledgerService.getActivity({
        startDate,
        endDate,
        type: "",
        status: "",
        symbol: "",
        page: 1,
        pageSize: 100,
      });
      const allItems = Array.isArray(allData.items) ? allData.items : [];
      setSummary(computeSummary(allItems));

      // Fetch the filtered + paginated activity for the table
      const data = await ledgerService.getActivity({
        startDate,
        endDate,
        type: effectiveType === "ALL" ? "" : effectiveType,
        status: status === "ALL" ? "" : status,
        symbol: symbol.trim() ? symbol.trim().toUpperCase() : "",
        page,
        pageSize,
      });

      setActivity(Array.isArray(data.items) ? data.items : []);
      setTotalPages(Number(data.totalPages || 1));
    } catch (e: unknown) {
      setError(String((e as Error).message || e));
    } finally {
      setLoadingActivity(false);
      setLoadingSummary(false);
    }
  }

  async function openDetails(activityId: string) {
    setDrawerOpen(true);
    setDetail(null);
    setDetailLoading(true);
    setDrawerError("");

    try {
      const data = await ledgerService.getActivityDetail(activityId);
      setDetail(data);
    } catch (e: unknown) {
      setDrawerError(String((e as Error).message || e));
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, effectiveType, status, symbol, page, pageSize]);

  function exportCSV() {
    const headers = ["timestamp", "type", "subtype", "symbol", "quantity", "price", "amount", "fee", "status", "notes"] as const;
    const rows = activity.map((x) =>
      headers.map((h) => {
        const v = x[h as keyof ActivityItem];
        return v === null || v === undefined ? "" : String(v).replaceAll('"', '""');
      })
    );

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "ledger_activity.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const summaryCards = [
    { title: "Net P/L", value: summary ? formatMoney(summary.netPL) : "--" },
    { title: "Realized P/L", value: summary ? formatMoney(summary.realizedPL) : "--" },
    { title: "Unrealized P/L (pending)", value: summary ? formatMoney(summary.unrealizedPL) : "--" },
    { title: "Cash Balance", value: summary ? formatMoney(summary.cashBalance) : "--" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0D0D14]">
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <LogoutConfirmationModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      <Header
        left={
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <img src={logoWhite} alt="" style={{ height: '47px', width: 'auto' }} className="brightness-0 dark:brightness-100" />
            <img src={orionTextWhite} alt="Orion" style={{ height: '29px', width: 'auto' }} className="brightness-0 dark:brightness-100" />
          </button>
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '240px', flexShrink: 0 }}>
              <TickerSearch value={tickerQuery} onChange={setTickerQuery} onSelect={(sym) => navigate(`/trade?symbol=${sym}`)} placeholder="Search for stocks..." />
            </div>
            <div style={{ width: '140px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleDark} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}>
                {dark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
              </button>
              <button aria-label="Profile" onClick={() => setProfileOpen(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', flexShrink: 0 }}>
                {currentUser?.profile_picture_url ? (
                  <img src={currentUser.profile_picture_url} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                )}
              </button>
              <button aria-label="Logout" onClick={() => setLogoutOpen(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}>
                <MdLogout size={22} />
              </button>
            </div>
          </div>
        }
      />

      <DetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        loading={detailLoading}
        detail={detail}
        drawerError={drawerError}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ← Return to home
        </button>
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">History</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your transaction activity across trades, transfers, fees, and dividends.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              aria-label="Export activity as CSV"
              className="rounded-xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] bg-white dark:bg-[#0f1520] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#121b2a]"
            >
              Export
            </button>
            <button
              onClick={() => window.print()}
              aria-label="Print page"
              className="rounded-xl bg-[#5B6AD4] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <Panel className="mt-6 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <FilterSelect
              label="Date Range"
              value={dateRange}
              onChange={setDateRange}
              options={[
                { label: "Today", value: "TODAY" },
                { label: "Last 7 Days", value: "7D" },
                { label: "Last 1 Month", value: "1M" },
                { label: "Year to Date", value: "YTD" },
                { label: "Custom", value: "CUSTOM" },
              ]}
              className="md:col-span-3"
            />

            <FilterDate
              label="Start (Custom)"
              value={customStart}
              onChange={setCustomStart}
              disabled={dateRange !== "CUSTOM"}
              className="md:col-span-3"
            />

            <FilterDate
              label="End (Custom)"
              value={customEnd}
              onChange={setCustomEnd}
              disabled={dateRange !== "CUSTOM"}
              className="md:col-span-3"
            />

            <FilterInput
              label="Symbol"
              value={symbol}
              onChange={setSymbol}
              placeholder="AAPL"
              className="md:col-span-3"
            />

            <FilterSelect
              label="Type"
              value={type}
              onChange={setType}
              options={[
                { label: "All", value: "ALL" },
                { label: "Trades", value: "TRADE" },
                { label: "Transfers", value: "TRANSFER" },
                { label: "Dividends", value: "DIVIDEND" },
                { label: "Fees", value: "FEE" },
                { label: "Interest", value: "INTEREST" },
              ]}
              className="md:col-span-3"
            />

            <FilterSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { label: "All", value: "ALL" },
                { label: "Pending", value: "PENDING" },
                { label: "Filled", value: "FILLED" },
                { label: "Completed", value: "COMPLETED" },
                { label: "Cancelled", value: "CANCELLED" },
                { label: "Failed", value: "FAILED" },
              ]}
              className="md:col-span-3"
            />

            <div className="md:col-span-6 flex items-end gap-2">
              <button
                onClick={() => {
                  fetchSummary();
                  fetchActivity();
                }}
                aria-label="Refresh data"
                className="w-full rounded-xl bg-[#5B6AD4] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              >
                Refresh
              </button>
            </div>
          </div>
        </Panel>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loadingSummary ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Panel key={i} className="p-4 animate-pulse">
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-[rgba(148,163,184,0.10)]" />
                <div className="mt-3 h-7 w-32 rounded bg-slate-200 dark:bg-[rgba(148,163,184,0.10)]" />
              </Panel>
            ))
          ) : (
            summaryCards.map((c) => <SummaryCard key={c.title} title={c.title} value={c.value} />)
          )}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <TabButton active={tab === "ALL"} onClick={() => setTab("ALL")} label="All" />
          <TabButton active={tab === "TRADES"} onClick={() => setTab("TRADES")} label="Trades" />
          <TabButton active={tab === "TRANSFERS"} onClick={() => setTab("TRANSFERS")} label="Transfers" />
          <TabButton active={tab === "DIVIDENDS"} onClick={() => setTab("DIVIDENDS")} label="Dividends" />
          <TabButton active={tab === "FEES"} onClick={() => setTab("FEES")} label="Fees" />
        </div>

        {/* Error – dismissible */}
        {error ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-[rgba(239,68,68,0.24)] bg-[rgba(239,68,68,0.12)] p-4 text-sm text-red-600 dark:text-red-200">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="ml-4 rounded-lg px-2 py-1 text-red-600 dark:text-red-200 hover:bg-[rgba(239,68,68,0.15)]"
            >
              ✕
            </button>
          </div>
        ) : null}

        {/* Table Card */}
        <Panel className="mt-4 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[rgba(148,163,184,0.12)] px-4 py-3">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Transactions</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Sorted by newest</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr className="bg-slate-50 dark:bg-[#0b111b]">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[rgba(148,163,184,0.10)]">
                {loadingActivity ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500 dark:text-slate-300">
                      Loading…
                    </td>
                  </tr>
                ) : activity.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="text-base font-semibold text-slate-900 dark:text-slate-100">No activity</div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try changing filters or dates.</div>
                    </td>
                  </tr>
                ) : (
                  activity.map((row) => {
                    const badge = typeBadge(row.type, row.subtype);
                    const amt = Number(row.amount);
                    const amountCls =
                      isNaN(amt) ? "text-slate-700 dark:text-slate-200" : amt >= 0 ? "text-[#00c805]" : "text-red-500 dark:text-red-300";

                    return (
                      <tr
                        key={row.id}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-[#121b2a]"
                        onClick={() => openDetails(row.id)}
                      >
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{formatDateTime(row.timestamp)}</td>

                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{row.symbol || "--"}</td>

                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {row.quantity != null ? formatNumber(row.quantity) : "--"}
                        </td>

                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {row.price != null ? `$${Number(row.price).toFixed(2)}` : "--"}
                        </td>

                        <td className={`px-4 py-3 font-semibold ${amountCls}`}>
                          {row.amount != null ? formatMoney(row.amount) : "--"}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${pillClass(row.status)}`}>
                            {row.status || "--"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.notes || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-[rgba(148,163,184,0.12)] px-4 py-3">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Page <span className="font-semibold text-slate-900 dark:text-slate-100">{page}</span> of{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loadingActivity}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
                className="rounded-xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] bg-white dark:bg-[#0f1520] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-[#121b2a]"
              >
                Prev
              </button>

              <button
                disabled={page >= totalPages || loadingActivity}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
                className="rounded-xl border border-slate-200 dark:border-[rgba(148,163,184,0.18)] bg-white dark:bg-[#0f1520] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-[#121b2a]"
              >
                Next
              </button>
            </div>
          </div>
        </Panel>

        <div className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          Clicking any row opens a details drawer (calls{" "}
          <code className="rounded bg-slate-100 dark:bg-[#0f1520] px-1 py-[2px] text-slate-700 dark:text-slate-200">/api/ledger/activity/:id</code>)
        </div>
      </div>
    </div>
  );
}
