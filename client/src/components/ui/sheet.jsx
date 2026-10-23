import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;

export function SheetContent({ side = "right", className, children, ...props }) {
  const sideClass = side === "left"
    ? "left-0 border-r"
    : "right-0 border-l";

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 z-50 w-[min(100%,480px)] bg-background p-6 shadow-2xl transition-transform",
          sideClass,
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 opacity-70 hover:bg-muted hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export const SheetHeader = ({ className, ...props }) => <div className={cn("mb-6 flex flex-col space-y-2", className)} {...props} />;
export const SheetTitle = ({ className, ...props }) => <DialogPrimitive.Title className={cn("text-xl font-semibold", className)} {...props} />;
export const SheetDescription = ({ className, ...props }) => <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
