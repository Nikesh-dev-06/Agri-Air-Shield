import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthPickerProps {
  year: number;
  month: number;
  onSelect: (year: number, month: number) => void;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MonthPicker = ({ year, month, onSelect }: MonthPickerProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelect(year - 1, month)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold text-foreground">{year}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelect(year + 1, month)}
          className="h-8 w-8"
          disabled={year >= 2026}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {months.map((m, i) => {
          const isSelected = i + 1 === month;
          const isFuture = year === 2026 && i + 1 > 3;
          return (
            <button
              key={m}
              disabled={isFuture}
              onClick={() => onSelect(year, i + 1)}
              className={`
                px-2 py-1.5 rounded-md text-xs font-medium transition-all
                ${isSelected
                  ? "bg-primary text-primary-foreground glow-primary"
                  : isFuture
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }
              `}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthPicker;
