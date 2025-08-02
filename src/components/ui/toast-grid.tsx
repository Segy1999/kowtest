import { Toaster } from "sonner";

export function ToastGrid() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      style={{
        marginTop: "1rem",
        marginRight: "1rem",
      }}
      toastOptions={{
        style: {
          marginBottom: "0.5rem",
          padding: "1rem",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          color: "var(--foreground)",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      }}
    />
  );
}
