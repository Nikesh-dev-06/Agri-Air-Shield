import { motion } from "framer-motion";
import { Brain, MapPin } from "lucide-react";
import { PredictedBurn } from "@/data/burnData";

interface PredictionTableProps {
  predictions: PredictedBurn[];
}

const PredictionTable = ({ predictions }: PredictionTableProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-[hsl(199,89%,48%)]" />
        <h3 className="text-sm font-bold text-foreground">Burn Predictions (Next 2 Weeks)</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Random Forest & XGBoost ensemble predictions based on satellite, weather, and crop cycle data.
      </p>

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {predictions.slice(0, 8).map((pred, i) => {
          const riskColor =
            pred.riskScore > 75
              ? "text-danger"
              : pred.riskScore > 50
              ? "text-warning"
              : "text-primary";
          const riskBg =
            pred.riskScore > 75
              ? "bg-danger/10 border-danger/20"
              : pred.riskScore > 50
              ? "bg-warning/10 border-warning/20"
              : "bg-primary/10 border-primary/20";

          return (
            <motion.div
              key={pred.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-lg border p-3 ${riskBg}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {pred.district}, {pred.state}
                  </span>
                </div>
                <span className={`text-lg font-black ${riskColor}`}>{pred.riskScore}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span>📅 {pred.predictedDate}</span>
                <span>🎯 {(pred.probability * 100).toFixed(0)}% probability</span>
                <span>🌾 {pred.crop}</span>
                <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] font-mono">
                  {pred.model}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionTable;
