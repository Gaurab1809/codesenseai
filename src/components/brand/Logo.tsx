export function Logo({ size = 22, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid place-items-center rounded-md bg-foreground text-background font-mono font-semibold"
        style={{ width: size + 6, height: size + 6, fontSize: size * 0.55 }}
      >
        cs
      </div>
      {withWordmark && (
        <span className="font-display font-semibold text-[15px] tracking-tight">
          CodeSense
        </span>
      )}
    </div>
  );
}
