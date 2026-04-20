import type { CSSProperties } from "react";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const iconButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  color: "var(--header-icon-color)",
  flexShrink: 0,
};

export function WalletHeaderNavButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="Wallet"
      onClick={() => navigate("/wallet")}
      style={iconButtonStyle}
    >
      <MdAccountBalanceWallet size={22} />
    </button>
  );
}
