"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const bloodPressureData = [
  { date: "Mon", systolic: 120, diastolic: 80 },
  { date: "Tue", systolic: 122, diastolic: 81 },
  { date: "Wed", systolic: 118, diastolic: 79 },
  { date: "Thu", systolic: 125, diastolic: 83 },
  { date: "Fri", systolic: 121, diastolic: 80 },
  { date: "Sat", systolic: 119, diastolic: 78 },
  { date: "Sun", systolic: 120, diastolic: 80 },
]

const cholesterolData = [
  { month: "Jan", total: 210, hdl: 45, ldl: 140 },
  { month: "Feb", total: 215, hdl: 44, ldl: 145 },
  { month: "Mar", total: 220, hdl: 43, ldl: 150 },
  { month: "Apr", total: 218, hdl: 44, ldl: 148 },
  { month: "May", total: 212, hdl: 46, ldl: 142 },
  { month: "Jun", total: 208, hdl: 47, ldl: 138 },
]

const weightData = [
  { week: "Week 1", weight: 75.5 },
  { week: "Week 2", weight: 75.2 },
  { week: "Week 3", weight: 74.8 },
  { week: "Week 4", weight: 74.5 },
  { week: "Week 5", weight: 74.1 },
  { week: "Week 6", weight: 73.8 },
]

export function BloodPressureChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={bloodPressureData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
        <YAxis stroke="var(--color-text-secondary)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-surface)",
            border: `1px solid var(--color-border)`,
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="systolic" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="diastolic" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function CholesterolChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={cholesterolData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
        <YAxis stroke="var(--color-text-secondary)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-surface)",
            border: `1px solid var(--color-border)`,
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Bar dataKey="hdl" fill="var(--color-accent)" />
        <Bar dataKey="ldl" fill="var(--color-primary)" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function WeightChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={weightData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="week" stroke="var(--color-text-secondary)" />
        <YAxis stroke="var(--color-text-secondary)" domain={[72, 76]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-surface)",
            border: `1px solid var(--color-border)`,
            borderRadius: "8px",
          }}
        />
        <Line type="monotone" dataKey="weight" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
