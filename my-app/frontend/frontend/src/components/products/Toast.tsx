export interface Toast {
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  duration?: number;
}