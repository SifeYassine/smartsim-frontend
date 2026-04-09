import { X } from "lucide-react";

export function NotificationToast({ message, type, onClose }) {
  const errorStyle = "bg-destructive/15 border-destructive/20 text-destructive";
  const successStyle = "bg-green-500/10 border-green-500 text-green-800 dark:text-green-400";
  const infoStyle = "bg-primary/15 border-primary/20 text-primary";

  let style = "";
  if (type === "error") {
    style = errorStyle;
  } else if (type === "success") {
    style = successStyle;
  } else {
    style = infoStyle;
  }

  return (
    <div className={`rounded-lg p-4 shadow-lg border ${style} transition-all`}>
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
