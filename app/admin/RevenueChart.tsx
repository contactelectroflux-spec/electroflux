"use client";

import { useState } from "react";

interface WeeklyRevenue {
  label: string;
  revenue: number;
}

export default function RevenueChart({ weeklyData, totalRevenue }: { weeklyData: WeeklyRevenue[]; totalRevenue: number }) {
  const [mode, setMode] = useState<"week" | "total">("week");
  const maxRev = Math.max(...weeklyData.map((w) => w.revenue), 1);

  return (
    <div className="admin-card admin-card--full">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Revenu — 8 dernières semaines</h2>
        <span className="admin-kpi-sub" style={{ fontSize: "0.85rem", color: "var(--electric)", fontWeight: 700 }}>
          Total payé : {totalRevenue} €
        </span>
      </div>
      {weeklyData.every((w) => w.revenue === 0) ? (
        <p className="admin-empty">Aucun paiement confirmé pour l&apos;instant.</p>
      ) : (
        <div className="admin-chart">
          {weeklyData.map((w) => (
            <div key={w.label} className="admin-chart-col">
              <span className="admin-chart-count">{w.revenue > 0 ? `${w.revenue}€` : ""}</span>
              <div className="admin-chart-bar-track">
                <div
                  className="admin-chart-bar-fill admin-chart-bar-fill--revenue"
                  style={{ height: `${Math.round((w.revenue / maxRev) * 100)}%` }}
                />
              </div>
              <span className="admin-chart-label">{w.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
