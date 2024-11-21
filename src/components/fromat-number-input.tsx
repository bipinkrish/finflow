import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  formatCurrency,
  formatNumberWithUnits,
  parseFormattedValue,
} from "@/lib/format";

interface NumberInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  unit?: string;
  showFooter?: boolean;
}

export function FormattedNumberInput({
  id,
  value,
  onChange,
  step = 1000,
  unit = "",
  showFooter = true,
}: NumberInputProps) {
  const formattedValue = formatNumberWithUnits(value);
  const stepFormatted = formatNumberWithUnits(step);

  const onValueChange = (rawValue: number) => {
    if (isNaN(rawValue) || rawValue < 0) {
      rawValue = 0;
    }
    onChange(rawValue);
  };

  return (
    <>
      <div className="relative flex items-center">
        {unit && (
          <span className="absolute left-0 top-0 bottom-0 border-r rounded-lg p-1 content-center">
            {unit}
          </span>
        )}
        <Input
          id={id}
          type="text"
          value={formatCurrency(value).replace("₹", "")}
          onChange={(e) => {
            const rawValue = parseFormattedValue(e.target.value);
            onValueChange(rawValue);
          }}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          inputMode="numeric"
          step={step}
          className={`"py-1 pr-10 ${unit ? 'pl-8' : 'pl-2'}`}
        />

        <div className="absolute right-0 top-0 bottom-0 flex flex-col border-l rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onValueChange(value + step)}
          >
            <ArrowUp />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onValueChange(value - step)}
          >
            <ArrowDown />
          </Button>
        </div>
      </div>
      {showFooter && (
        <div className="flex justify-between text-right text-sm text-muted-foreground mx-2">
          <span>{formattedValue}</span>
          <span>+{stepFormatted}</span>
        </div>
      )}
    </>
  );
}
