import { motion } from "framer-motion";
import { AlertTriangle, Wind, Heart } from "lucide-react";
import { AQIWarning } from "@/data/burnData";

interface AQIWarningPanelProps {
  warnings: AQIWarning[];
}

const categoryColors: Record<string, string> = {
  Good: "text-success",
  Moderate: "text-warning",
  Unhealthy: "text-primary",
  "Very Unhealthy": "text-danger",
  Hazardous: "text-danger",
};

const categoryBg: Record<string, string> = {
  Good: "bg-success/10 border-success/20",
  Moderate: "bg-warning/10 border-warning/20",
  Unhealthy: "bg-primary/10 border-primary/20",
  "Very Unhealthy": "bg-danger/10 border-danger/20",
  Hazardous: "bg-danger/20 border-danger/30",
};

const AQIWarningPanel = ({ warnings }: AQIWarningPanelProps) => {
  const hazardous = warnings.filter(
    (w) => w.predictedCategory === "Hazardous" || w.predictedCategory === "Very Unhealthy"
  );

  return (
    <div className="space-y-3">
      {hazardous.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-card rounded-xl border border-danger/40 p-4 glow-danger"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-danger animate-pulse" />
            <h3 className="text-sm font-bold text-danger">CRITICAL AQI ALERT</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Predicted hazardous air quality in {hazardous.length} cities due to upcoming crop burns.
            Immediate intervention recommended.
          </p>
        </motion.div>
      )}

      <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/10">
        {warnings.map((warning, i) => (
          <motion.div
            key={warning.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-lg border p-3 ${categoryBg[warning.predictedCategory]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{warning.city}</span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wind className="h-3 w-3" />
                {warning.windDirection}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Now: </span>
                <span className={`font-bold ${categoryColors[warning.category]}`}>
                  {warning.currentAQI}
                </span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div>
                <span className="text-muted-foreground">Predicted: </span>
                <span className={`font-bold ${categoryColors[warning.predictedCategory]}`}>
                  {warning.predictedAQI}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-start gap-1.5">
              <Heart className="h-3 w-3 text-danger mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">{warning.healthRisk}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AQIWarningPanel;
