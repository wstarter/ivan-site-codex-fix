import * as SliderPrimitive from "@radix-ui/react-slider";
import { budgetConfig, formatBudget, type FormKey } from "@/lib/forms-config";

/**
 * Single-handle budget slider.
 * - Centralized min/max/step via `budgetConfig`.
 * - One selected value; hidden input `budget` for submission.
 * - Future WP/CF7: this single budget value maps to one form field named "budget".
 */
export function BudgetSlider({
  value,
  onChange,
  formKey,
}: {
  value: number;
  onChange: (v: number) => void;
  formKey?: FormKey;
}) {
  const { min, max, step } = budgetConfig;

  return (
    <div className="form-budget-slider space-y-4" data-form-key={formKey ?? "generic"}>
      <div className="form-budget-value text-sm text-muted-foreground">
        Planirani budžet: <span className="gold-text font-semibold">{formatBudget(value)}</span>
      </div>

      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center h-6"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        aria-label="Budžet"
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Izabrani budžet"
          className="block h-5 w-5 rounded-full bg-primary border-2 border-background shadow-md transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:scale-110"
        />
      </SliderPrimitive.Root>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatBudget(min)}</span>
        <span>{formatBudget(max)}</span>
      </div>

      {/* CF7-ready: single submission value mapped to one form field "budget". */}
      <input className="form-budget-input" type="hidden" name="budget" value={value} readOnly />
    </div>
  );
}