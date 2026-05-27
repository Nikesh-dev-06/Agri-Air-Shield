import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "warning" | "danger" | "success";
}

const variantStyles = {
  default: "border-border glow-primary",
  warning: "border-warning/30 glow-warning",
  danger: "border-danger/30 glow-danger",
  success: "border-success/30",
};

const iconVariants = {
  default: "text-primary",
  warning: "text-warning",
  danger: "text-danger",
  success: "text-success",
};

const StatsCard = ({ title, value, subtitle, icon: Icon, variant = "default" }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`gradient-card rounded-xl border p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`rounded-lg bg-secondary p-2.5 ${iconVariants[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
