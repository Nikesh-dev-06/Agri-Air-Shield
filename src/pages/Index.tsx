import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Wind, BarChart3, Brain, Leaf, AlertTriangle, Map, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import BurnMap from "@/components/BurnMap";
import MonthPicker from "@/components/MonthPicker";
import StatsCard from "@/components/StatsCard";
import AQIWarningPanel from "@/components/AQIWarningPanel";
import CropAlternativesPanel from "@/components/CropAlternativesPanel";
import PredictionTable from "@/components/PredictionTable";
import BurnChart from "@/components/BurnChart";
import {
  generateBurnEvents,
  generatePredictions,
  generateAQIWarnings,
  cropAlternatives,
  getMonthlyStats,
} from "@/data/burnData";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showAQI, setShowAQI] = useState(true);

  const burns = useMemo(() => generateBurnEvents(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  const stats = useMemo(() => getMonthlyStats(selectedYear, selectedMonth), [selectedYear, selectedMonth]);
  const predictions = useMemo(() => generatePredictions(), []);
  const aqiWarnings = useMemo(() => generateAQIWarnings(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-fire p-2 rounded-lg">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                AgriAir<span className="text-gradient-fire">Shield</span>
              </h1>
              <p className="text-[11px] text-muted-foreground">
                AI-Powered Crop Burn Prevention & AQI Forecasting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showPredictions ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPredictions(!showPredictions)}
              className="text-xs gap-1.5"
            >
              <Brain className="h-3.5 w-3.5" />
              Predictions
              {showPredictions ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              variant={showAQI ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAQI(!showAQI)}
              className="text-xs gap-1.5"
            >
              <Wind className="h-3.5 w-3.5" />
              AQI Alerts
              {showAQI ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Burn Events"
            value={stats.totalEvents}
            subtitle={monthName}
            icon={Flame}
            variant="danger"
          />
          <StatsCard
            title="Area Burned"
            value={`${stats.totalArea.toLocaleString()} ha`}
            subtitle="Total hectares"
            icon={Map}
          />
          <StatsCard
            title="Avg Fire Power"
            value={`${stats.avgFRP} MW`}
            subtitle="Radiative power"
            icon={BarChart3}
            variant="warning"
          />
          <StatsCard
            title="High Risk Zones"
            value={predictions.filter((p) => p.riskScore > 70).length}
            subtitle="Next 2 weeks"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Month Picker + Chart + Legend */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="gradient-card rounded-xl border border-border p-4"
            >
              <h3 className="text-sm font-bold text-foreground mb-3">📅 Select Period</h3>
              <MonthPicker year={selectedYear} month={selectedMonth} onSelect={handleMonthSelect} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="gradient-card rounded-xl border border-border p-4"
            >
              <h3 className="text-sm font-bold text-foreground mb-3">📊 Yearly Trend</h3>
              <BurnChart year={selectedYear} selectedMonth={selectedMonth} />
            </motion.div>
          </div>

          {/* Center: Map */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gradient-card rounded-xl border border-border p-4 h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground">
                  🔥 Burn Activity — {monthName}
                </h3>
                <span className="text-[11px] bg-secondary px-2 py-1 rounded-md text-muted-foreground">
                  {burns.length} events
                </span>
              </div>
              <BurnMap
                burns={burns}
                predictions={predictions}
                aqiWarnings={aqiWarnings}
                showPredictions={showPredictions}
                showAQI={showAQI}
              />
            </motion.div>
          </div>

          {/* Right Sidebar: Legend + Predictions + AQI */}
          <div className="lg:col-span-5 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="gradient-card rounded-xl border border-border p-4"
            >
              <h3 className="text-sm font-bold text-foreground mb-3">🗺️ Map Legend</h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-muted-foreground">Low intensity burn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f97316]" />
                  <span className="text-muted-foreground">Medium intensity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="text-muted-foreground">High intensity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
                  <span className="text-muted-foreground">Extreme intensity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#22c55e] border border-white shadow-md" />
                  <span className="text-muted-foreground">Burn start point</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-dashed border-blue-400 bg-blue-500/30" />
                  <span className="text-muted-foreground">Predicted burn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-red-400 bg-red-500/30" />
                  <span className="text-muted-foreground">AQI warning city</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="gradient-card rounded-xl border border-border p-4"
            >
              <PredictionTable predictions={predictions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="gradient-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-danger" />
                <h3 className="text-sm font-bold text-foreground">AQI Warnings</h3>
              </div>
              <AQIWarningPanel warnings={aqiWarnings} />
            </motion.div>
          </div>
        </div>

        {/* AQI Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Wind className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-bold text-foreground">
              AQI Impact Dashboard — {monthName}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Real-time air quality predictions for major cities affected by crop residue burning
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {aqiWarnings.map((warning, i) => {
              const aqiColor = warning.predictedAQI > 300 ? "text-danger" : warning.predictedAQI > 200 ? "text-primary" : warning.predictedAQI > 100 ? "text-warning" : "text-success";
              const aqiBg = warning.predictedAQI > 300 ? "bg-danger/10 border-danger/30" : warning.predictedAQI > 200 ? "bg-primary/10 border-primary/30" : warning.predictedAQI > 100 ? "bg-warning/10 border-warning/30" : "bg-success/10 border-success/30";
              return (
                <motion.div
                  key={warning.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className={`rounded-lg border p-4 transition-all hover:shadow-lg ${aqiBg}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">🏙️ {warning.city}</h4>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Wind className="h-3 w-3" /> {warning.windDirection}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-muted-foreground">Current AQI</div>
                        <div className="text-lg font-black text-foreground">{warning.currentAQI}</div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground">Predicted</div>
                        <div className={`text-lg font-black ${aqiColor}`}>{warning.predictedAQI}</div>
                      </div>
                    </div>
                    <div className="h-1 bg-secondary/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(warning.predictedAQI / 500) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                        className={`h-full rounded-full ${warning.predictedAQI > 300 ? "bg-danger" : warning.predictedAQI > 200 ? "bg-primary" : warning.predictedAQI > 100 ? "bg-warning" : "bg-success"}`}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-snug mb-2">{warning.healthRisk}</p>
                  <div className="text-[9px] text-muted-foreground bg-black/20 px-2 py-1 rounded">
                    {warning.affectedBy.slice(0, 2).join(", ")}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom: Crop Alternatives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="h-5 w-5 text-success" />
            <h2 className="text-lg font-bold text-foreground">
              Sustainable Alternatives — Don't Burn, Earn!
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            High-value alternatives to crop burning. Economic opportunities for farmers from agricultural residue
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cropAlternatives.sort((a, b) => b.profitPerTon - a.profitPerTon).map((alt, i) => (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-lg transition-all gradient-card"
              >
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-2xl">{alt.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">{alt.alternative}</h4>
                    <span className="text-[10px] text-muted-foreground">{alt.crop}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-snug">{alt.description}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-bold text-foreground">₹{alt.revenuePerTon}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-bold text-foreground">₹{alt.costPerTon}</span>
                  </div>
                  <div className="h-0.5 bg-border rounded-full" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-bold">Profit/ton:</span>
                    <span className="text-sm font-black text-success">+₹{alt.profitPerTon}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                    alt.category === "energy" ? "bg-primary/20 text-primary" :
                    alt.category === "fertilizer" ? "bg-success/20 text-success" :
                    alt.category === "industrial" ? "bg-accent/20 text-accent" :
                    "bg-warning/20 text-warning"
                  }`}>
                    {alt.category}
                  </span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(alt.profitPerTon / 200) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                    className="h-1 bg-gradient-to-r from-success/50 to-success rounded-full flex-1 ml-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center py-4 text-[11px] text-muted-foreground border-t border-border">
          AgriAirShield — AI-Powered Preventive Air Quality Management • Random Forest & XGBoost Models •
          Data Sources: MODIS, VIIRS, CPCB, IMD
        </footer>
      </main>
    </div>
  );
};

export default Index;
