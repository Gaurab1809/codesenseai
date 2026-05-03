export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-[var(--coral)] translate-x-1 translate-y-1" />
        <div className="relative grid place-items-center h-9 w-9 rounded-xl bg-[var(--lime)] border-2 border-foreground font-mono font-bold text-[15px] text-foreground">
          {"</>"}
        </div>
      </div>
      {withWordmark && (
        <span className="font-display font-bold text-[16px] tracking-tight">
          CodeSense
          <span className="ml-1 align-top text-[10px] font-mono px-1 py-px bg-foreground text-background rounded">AI</span>
        </span>
      )}
    </div>
  );
}
