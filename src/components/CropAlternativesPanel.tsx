import { motion } from "framer-motion";
import { TrendingUp, IndianRupee } from "lucide-react";
import { CropAlternative } from "@/data/burnData";

interface CropAlternativesPanelProps {
  alternatives: CropAlternative[];
}

const categoryBadge: Record<string, string> = {
  energy: "bg-primary/15 text-primary",
  fertilizer: "bg-success/15 text-success",
  industrial: "bg-accent/15 text-accent-foreground",
  export: "bg-warning/15 text-warning",
};

const CropAlternativesPanel = ({ alternatives }: CropAlternativesPanelProps) => {
  const sorted = [...alternatives].sort((a, b) => b.profitPerTon - a.profitPerTon);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-4 w-4 text-success" />
        <h3 className="text-sm font-bold text-foreground">Monetization Alternatives</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Transform crop residue into income. Profit per ton of stubble processed:
      </p>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {sorted.map((alt, i) => (
          <motion.div
            key={alt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="gradient-card rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{alt.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{alt.alternative}</h4>
                  <span className="text-[11px] text-muted-foreground">{alt.crop}</span>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryBadge[alt.category]}`}>
                {alt.category}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">{alt.description}</p>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-success" />
                <span className="text-success font-bold">+₹{alt.profitPerTon}</span>
                <span className="text-muted-foreground">/ton</span>
              </div>
              <div className="h-3 w-px bg-border" />
              <span className="text-muted-foreground">
                Revenue: ₹{alt.revenuePerTon} · Cost: ₹{alt.costPerTon}
              </span>
            </div>

            {/* Profit bar */}
            <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(alt.profitPerTon / 200) * 100}%` }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-success to-primary"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CropAlternativesPanel;
