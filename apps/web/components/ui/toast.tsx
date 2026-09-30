"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Button } from "./button";

type Push = (message: string) => void;
const Ctx = createContext<Push>(() => {});

export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string }[]>([]);
  const next = useRef(0);
  const push = useCallback<Push>((message) => {
    const id = next.current++;
    setItems((l) => [...l.slice(-2), { id, message }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2">
        {items.map((t) => (
          <div key={t.id} role="status" className="pointer-events-auto rounded-md border border-line-strong bg-surface px-4 py-3 text-sm shadow-[var(--shadow-raised)]">
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

/** Button that answers with a toast. Stands in for an action the API will perform later. */
export function DemoButton({ toast, children, ...rest }: { toast: string } & React.ComponentProps<typeof Button>) {
  const push = useToast();
  return <Button {...rest} onClick={() => push(toast)}>{children}</Button>;
}

export function CopyButton({ text, ...rest }: { text: string } & React.ComponentProps<typeof Button>) {
  const push = useToast();
  return (
    <Button {...rest} onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); push("Copied " + text); }}>
      {rest.children ?? "Copy code"}
    </Button>
  );
}
