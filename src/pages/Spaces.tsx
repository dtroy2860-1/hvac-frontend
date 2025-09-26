import React, { useEffect, useState } from "react"
import { Space, fetchSpaces, fetchSavings } from "../api"
import { SpaceDetail } from "../components/SpaceDetail"
import { SavingsCard } from "../components/SavingsCard"

export function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [selected, setSelected] = useState<Space|null>(null)
  const [savings, setSavings] = useState<Record<string, any>>({})

  const load = async () => {
    const s = await fetchSpaces()
    setSpaces(s)
    const metrics = await fetchSavings(s.map(x => x.id))
    const byId: Record<string, any> = {}
    metrics.forEach(m => byId[m.space_id] = m)
    setSavings(byId)
  }
  useEffect(()=>{ load() }, [])

  return (
    <div className="grid" style={{gap:16}}>
      <div className="row" style={{justifyContent:"space-between"}}>
        <h2>Spaces</h2>
        <button className="button" onClick={load}>Refresh</button>
      </div>

      <div className="row" style={{gap:16}}>
        <SavingsCard title="Total Savings (kWh)" value={Object.values(savings).reduce((a:any,b:any)=>a+b.kwh_saved,0).toFixed(0)} />
        <SavingsCard title="Average % Saved" value={(Object.values(savings).reduce((a:any,b:any)=>a+b.pct_saved,0) / (Object.keys(savings).length||1) * 100).toFixed(1) + "%"} />
        <SavingsCard title="Total Cost Saved" value={"AED " + Object.values(savings).reduce((a:any,b:any)=>a+b.cost_saved,0).toFixed(0)} />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Space</th>
              <th>Mode</th>
              <th>Target (°C)</th>
              <th>Min/Max (°C)</th>
              <th>Change Budget</th>
              <th>Last Profile</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map(s => (
              <tr key={s.id} onClick={()=>setSelected(s)} style={{cursor:"pointer"}}>
                <td>{s.name}</td>
                <td><span className="badge ok">{s.loop_mode}</span></td>
                <td>{s.targets.zone_temp_c?.toFixed?.(1) ?? "-"}</td>
                <td>{s.min_max.zone_temp_c.min}–{s.min_max.zone_temp_c.max}</td>
                <td>{s.change_budget.n} / {Math.round(s.change_budget.window_s/60)}m</td>
                <td>{s.last_profile_applied ?? "-"}</td>
                <td>{savings[s.id] ? `${(savings[s.id].pct_saved*100).toFixed(0)}% • ${savings[s.id].kwh_saved.toFixed(0)} kWh` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <SpaceDetail spaceId={selected.id} onClose={()=>setSelected(null)} onUpdated={load}/>}
    </div>
  )
}
