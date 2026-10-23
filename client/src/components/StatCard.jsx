import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, helper, icon: Icon, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <Card className="surface-card group overflow-hidden border-slate-200/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <p className="mt-5 text-[13px] font-medium text-slate-500">{label}</p>
        <p className="mt-1 font-[Manrope] text-[30px] font-bold leading-none tracking-tight text-slate-950">{value}</p>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">{helper}</p>
      </CardContent>
    </Card>
  );
}
