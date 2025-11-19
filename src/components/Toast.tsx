import type React from "react";
import { useEffect, useImperativeHandle, useState } from "react";
import { UI, type UIState } from "@/config";

export type ToastHandle = {
  show: (message: string, state: UIState) => void;
  hide: () => void;
};

type ToastProps = {
  ref?: React.RefObject<ToastHandle | null>;
};

const Toast = ({ ref }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<UIState>("recording");

  useImperativeHandle(ref, () => ({
    show: (msg: string, newState: UIState) => {
      setMessage(msg);
      setState(newState);
      setIsVisible(true);
    },
    hide: () => {
      setIsVisible(false);
    },
  }));

  // Auto-hide for complete/error states
  useEffect(() => {
    if (isVisible && (state === "complete" || state === "error")) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, UI.TOAST_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, state]);

  const getBorderColor = (currentState: UIState): string => {
    const colors = {
      recording: "rgba(94, 106, 210, 0.2)",
      transcribing: "rgba(94, 106, 210, 0.2)",
      processing: "rgba(94, 106, 210, 0.2)",
      complete: "rgba(76, 183, 130, 0.2)",
      error: "rgba(242, 84, 91, 0.2)",
    };
    return colors[currentState] || "rgba(94, 106, 210, 0.2)";
  };

  const getStateIcon = (currentState: UIState): React.ReactElement => {
    const iconColor = getStateColor(currentState);

    const icons: Record<UIState, React.ReactElement> = {
      recording: (
        <div
          style={{
            position: "relative",
            width: "20px",
            height: "20px",
            flexShrink: 0,
          }}
        >
          <svg
            aria-label="Recording"
            fill="none"
            height="20"
            role="img"
            viewBox="0 0 20 20"
            width="20"
          >
            <circle cx="10" cy="10" fill={iconColor} opacity="0.2" r="4" />
            <circle cx="10" cy="10" fill={iconColor} r="2.5" />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: "0",
              borderRadius: "50%",
              background: iconColor,
              opacity: 0.3,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.4); opacity: 0; }
            }
          `}</style>
        </div>
      ),
      transcribing: (
        <svg
          aria-label="Transcribing"
          fill="none"
          height="20"
          role="img"
          style={{ flexShrink: 0 }}
          viewBox="0 0 20 20"
          width="20"
        >
          <path
            d="M10 3v14M10 17l-4-4M10 17l4-4"
            stroke={iconColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      ),
      processing: (
        <>
          <svg
            aria-label="Processing"
            fill="none"
            height="20"
            role="img"
            style={{ flexShrink: 0, animation: "spin 1s linear infinite" }}
            viewBox="0 0 20 20"
            width="20"
          >
            <path
              d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16"
              opacity="0.8"
              stroke={iconColor}
              strokeDasharray="12 38"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ),
      complete: (
        <svg
          aria-label="Complete"
          fill="none"
          height="20"
          role="img"
          style={{ flexShrink: 0 }}
          viewBox="0 0 20 20"
          width="20"
        >
          <circle
            cx="10"
            cy="10"
            opacity="0.2"
            r="8"
            stroke={iconColor}
            strokeWidth="1.5"
          />
          <path
            d="M6 10l3 3 5-6"
            stroke={iconColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      ),
      error: (
        <svg
          aria-label="Error"
          fill="none"
          height="20"
          role="img"
          style={{ flexShrink: 0 }}
          viewBox="0 0 20 20"
          width="20"
        >
          <circle
            cx="10"
            cy="10"
            opacity="0.2"
            r="8"
            stroke={iconColor}
            strokeWidth="1.5"
          />
          <path
            d="M12.5 7.5L7.5 12.5M7.5 7.5l5 5"
            stroke={iconColor}
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
      ),
    };

    return icons[currentState] || icons.recording;
  };

  const getStateTitle = (currentState: UIState): string => {
    const titles = {
      recording: "Listening",
      transcribing: "Transcribing",
      processing: "Processing",
      complete: "Success",
      error: "Error",
    };
    return titles[currentState] || "Voice Command";
  };

  const getStateColor = (currentState: UIState): string => {
    const colors = {
      recording: "#5E6AD2",
      transcribing: "#5E6AD2",
      processing: "#5E6AD2",
      complete: "#4CB782",
      error: "#F2545B",
    };
    return colors[currentState] || "#5E6AD2";
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        minWidth: "300px",
        maxWidth: "400px",
        background: "rgba(28, 31, 43, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${getBorderColor(state)}`,
        borderRadius: "12px",
        padding: "16px 20px",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.02)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
        fontSize: "14px",
        lineHeight: "1.5",
        zIndex: 999_999,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(8px) scale(0.96)",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {getStateIcon(state)}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.95)",
              marginBottom: "4px",
              fontSize: "13px",
            }}
          >
            {getStateTitle(state)}
          </div>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

Toast.displayName = "Toast";

export default Toast;
