import { cn } from "@/lib/cn";

const control = "w-full rounded-md border border-line-strong bg-surface px-3 text-base text-ink placeholder:text-muted focus:border-accent";

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, "h-11", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, "h-11", className)} {...rest}>{children}</select>;
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "py-2.5", className)} {...rest} />;
}

export function Field({ label, htmlFor, hint, children }: {
  label: string; htmlFor: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function Checkbox({ id, label, description, defaultChecked }: {
  id: string; label: string; description?: string; defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" defaultChecked={defaultChecked} className="mt-1 size-4 accent-[var(--accent)]" />
      <label htmlFor={id} className="flex flex-col gap-0.5">
        <span className="font-medium text-ink">{label}</span>
        {description && <span className="text-sm text-ink-2">{description}</span>}
      </label>
    </div>
  );
}
