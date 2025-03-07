// Modern color palettes for charts
export const colorPalettes = {
    // Primary palette - blues and teals
    primary: [
      "#0ea5e9", // sky-500
      "#0284c7", // sky-600
      "#0369a1", // sky-700
      "#075985", // sky-800
      "#0c4a6e", // sky-900
    ],
  
    // Secondary palette - purples and pinks
    secondary: [
      "#c084fc", // purple-400
      "#a855f7", // purple-500
      "#9333ea", // purple-600
      "#7e22ce", // purple-700
      "#6b21a8", // purple-800
    ],
  
    // Accent palette - greens
    accent: [
      "#10b981", // emerald-500
      "#059669", // emerald-600
      "#047857", // emerald-700
      "#065f46", // emerald-800
      "#064e3b", // emerald-900
    ],
  
    // Neutral palette - grays
    neutral: [
      "#94a3b8", // slate-400
      "#64748b", // slate-500
      "#475569", // slate-600
      "#334155", // slate-700
      "#1e293b", // slate-800
    ],
  
    // Categorical palette - for pie/donut charts
    categorical: [
      "#0ea5e9", // sky-500
      "#a855f7", // purple-500
      "#10b981", // emerald-500
      "#f59e0b", // amber-500
      "#ef4444", // red-500
      "#8b5cf6", // violet-500
      "#06b6d4", // cyan-500
      "#f97316", // orange-500
      "#ec4899", // pink-500
      "#14b8a6", // teal-500
    ],
  
    // Gradient definitions
    gradients: {
      blue: ["rgba(14, 165, 233, 0.2)", "rgba(14, 165, 233, 0)"],
      purple: ["rgba(168, 85, 247, 0.2)", "rgba(168, 85, 247, 0)"],
      green: ["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0)"],
      amber: ["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 0)"],
      red: ["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0)"],
    },
  }
  
  // Chart styling defaults
  export const chartDefaults = {
    // Common grid styling
    grid: {
      strokeDasharray: "3 3",
      stroke: "#e2e8f0", // slate-200
      vertical: false,
    },
  
    // Axis styling
    axis: {
      stroke: "#cbd5e1", // slate-300
      tick: {
        stroke: "#94a3b8", // slate-400
        fontSize: 12,
      },
    },
  
    // Tooltip styling
    tooltip: {
      contentStyle: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        padding: "8px 12px",
      },
      labelStyle: {
        fontWeight: 600,
        marginBottom: "4px",
        color: "#1e293b", // slate-800
      },
      itemStyle: {
        padding: "2px 0",
      },
    },
  
    // Animation config
    animation: {
      duration: 1000,
      easing: "ease-out",
    },
  }
  
  // Custom tooltip formatter
  export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  // Custom tooltip formatter for percentages
  export const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }
  
  