"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PerformancePoint } from "@/lib/types";

type PerformanceChartProps = {
  data: PerformancePoint[];
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-72 w-full rounded-2xl bg-secondary/70" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -18, right: 12, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="nilai" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.34} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="rataRata" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#08b6d8" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#08b6d8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.28)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              boxShadow: "0 16px 44px rgba(16, 32, 51, 0.10)",
            }}
            labelStyle={{ fontWeight: 800 }}
          />
          <Area
            type="monotone"
            dataKey="rataRata"
            name="Rata-rata"
            stroke="#08b6d8"
            fill="url(#rataRata)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="nilai"
            name="Nilai"
            stroke="#2563eb"
            fill="url(#nilai)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
