import React from "react";

export interface StatusFilterOption {
  label: string;
  value: string;
  count?: number;
}

interface StatusFilterChipsProps {
  options: StatusFilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
}

export const StatusFilterChips: React.FC<StatusFilterChipsProps> = ({
  options,
  activeValue,
  onChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
      }}
    >
      {options.map((opt) => {
        const isActive = activeValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              border: isActive ? "none" : "1px solid #e2e8f0",
              background: isActive
                ? "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)"
                : "#ffffff",
              color: isActive ? "#ffffff" : "#475569",
              boxShadow: isActive
                ? "0 4px 14px rgba(13, 148, 136, 0.35)"
                : "0 1px 3px rgba(0,0,0,0.03)",
              outline: "none",
              transform: isActive ? "translateY(-1px)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "#0d9488";
                e.currentTarget.style.color = "#0d9488";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 3px 8px rgba(13, 148, 136, 0.12)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#475569";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
              }
            }}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 19,
                  height: 19,
                  padding: "0 6px",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.25)" : "#f1f5f9",
                  color: isActive ? "#ffffff" : "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
