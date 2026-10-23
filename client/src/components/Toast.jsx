import { CircleCheck } from "lucide-react";

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div role="status" className="fixed bottom-24 left-4 right-4 z-[100] flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_-18px_rgba(15,23,42,.4)] sm:left-auto sm:bottom-5 sm:right-5 sm:w-[360px]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CircleCheck className="h-4 w-4" /></span>
      <div><p className="text-sm font-bold text-slate-900">{toast.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{toast.message}</p></div>
    </div>
  );
}
