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
}

export function FormattedNumberInput({
  id,
  value,
  onChange,
  step = 1000,
}: NumberInputProps) {
  const formattedValue = formatNumberWithUnits(value);
  const stepFormatted = formatNumberWithUnits(step);

  const onValueChange = (rawValue: number) => {
    if (!isNaN(rawValue) && rawValue >= 0) {
      onChange(rawValue);
    }
  };

  return (
    <>
      <div className="relative flex items-center">
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
          className="py-1 pl-2 pr-10"
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
      <div className="flex justify-between text-right text-sm text-muted-foreground mx-2">
        <span>{formattedValue}</span>
        <span>+{stepFormatted}</span>
      </div>
    </>
  );
}
