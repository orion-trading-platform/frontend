import type { CSSProperties } from "react";
import { RiFolderHistoryFill } from "react-icons/ri";
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

export function LedgerHeaderNavButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="Ledger"
      onClick={() => navigate("/ledger")}
      style={iconButtonStyle}
    >
      <RiFolderHistoryFill size={24} aria-hidden />
    </button>
  );
}
