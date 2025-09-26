import React from "react"
export function SavingsCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card" style={{minWidth:240}}>
      <div style={{fontSize:12, color:"var(--muted)"}}>{title}</div>
      <div style={{fontSize:28, fontWeight:700}}>{value}</div>
    </div>
  )
}
