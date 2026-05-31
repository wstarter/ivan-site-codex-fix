export function BudgetRange({
  min, max, from, to, onFrom, onTo,
}: {
  min: number; max: number;
  from: number; to: number;
  onFrom: (v: number) => void;
  onTo: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Od: <span className="gold-text font-semibold">{from.toLocaleString("sr-RS")}€</span></span>
        <span className="text-muted-foreground">Do: <span className="gold-text font-semibold">{to.toLocaleString("sr-RS")}€</span></span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          className="input-base"
          min={min}
          max={max}
          value={from}
          onChange={(e) => onFrom(Math.min(Number(e.target.value || min), to))}
          placeholder={`Min ${min}€`}
          aria-label="Budžet od"
        />
        <input
          type="number"
          className="input-base"
          min={min}
          max={max}
          value={to}
          onChange={(e) => onTo(Math.max(Number(e.target.value || max), from))}
          placeholder={`Max ${max}€`}
          aria-label="Budžet do"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{min.toLocaleString("sr-RS")}€</span>
        <span>{max.toLocaleString("sr-RS")}€</span>
      </div>
    </div>
  );
}