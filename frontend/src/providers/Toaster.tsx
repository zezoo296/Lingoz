import { Toaster } from "react-hot-toast";

const toastOptions = {
  duration: 3000,

  style: {
    background: "var(--color-surface-elevated)",
    color: "var(--color-text-primary)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    padding: "12px 16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
  },

  success: {
    iconTheme: {
      primary: "var(--color-success)",
      secondary: "var(--color-surface)",
    },
  },

  error: {
    iconTheme: {
      primary: "var(--color-error)",
      secondary: "var(--color-surface)",
    },
  },
};

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={toastOptions}
    />
  );
}