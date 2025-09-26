import React, { useEffect, useState } from "react"
import { api } from "../api"

export function PlantPage() {
  const [cfg, setCfg] = useState<any>(null)
  const load = async () => { const { data } = await api.get("/v1/hvac/plant"); setCfg(data) }
  useEffect(()=>{ load() }, [])
  if (!cfg) return <div className="card">Loading plant config…</div>
  return (
    <div className="grid" style={{gap:16}}>
      <div className="row" style={{justifyContent:"space-between"}}>
        <h2>Plant</h2>
        <button className="button" onClick={load}>Refresh</button>
      </div>
      <div className="card grid cols-3">
        <div>
          <div>CHWST Target (°C)</div>
          <input className="input" type="number" step={0.1}
            value={cfg.targets.chwst_c}
            onChange={(e)=>setCfg({...cfg, targets: {...cfg.targets, chwst_c: parseFloat(e.target.value)}})} />
          <div style={{marginTop:8}}>Min/Max</div>
          <div className="row">
            <input className="input" type="number" step={0.1} value={cfg.min_max.chwst_c.min}
              onChange={(e)=>setCfg({...cfg, min_max: {...cfg.min_max, chwst_c: {...cfg.min_max.chwst_c, min: parseFloat(e.target.value)}}})} />
            <span>to</span>
            <input className="input" type="number" step={0.1} value={cfg.min_max.chwst_c.max}
              onChange={(e)=>setCfg({...cfg, min_max: {...cfg.min_max, chwst_c: {...cfg.min_max.chwst_c, max: parseFloat(e.target.value)}}})} />
          </div>
        </div>
        <div>
          <div>LCHWST Target (°C)</div>
          <input className="input" type="number" step={0.1}
            value={cfg.targets.lchwst_c}
            onChange={(e)=>setCfg({...cfg, targets: {...cfg.targets, lchwst_c: parseFloat(e.target.value)}})} />
          <div style={{marginTop:8}}>Min/Max</div>
          <div className="row">
            <input className="input" type="number" step={0.1} value={cfg.min_max.lchwst_c.min}
              onChange={(e)=>setCfg({...cfg, min_max: {...cfg.min_max, lchwst_c: {...cfg.min_max.lchwst_c, min: parseFloat(e.target.value)}}})} />
            <span>to</span>
            <input className="input" type="number" step={0.1} value={cfg.min_max.lchwst_c.max}
              onChange={(e)=>setCfg({...cfg, min_max: {...cfg.min_max, lchwst_c: {...cfg.min_max.lchwst_c, max: parseFloat(e.target.value)}}})} />
          </div>
        </div>
        <div>
          <div>Change Budget</div>
          <div className="row">
            <input className="input" type="number" value={cfg.change_budget.n}
              onChange={(e)=>setCfg({...cfg, change_budget: {...cfg.change_budget, n: parseInt(e.target.value||"0")}})} />
            <input className="input" type="number" value={Math.round(cfg.change_budget.window_s/60)}
              onChange={(e)=>setCfg({...cfg, change_budget: {...cfg.change_budget, window_s: parseInt(e.target.value||"0")*60}})} />
            <span>changes / minutes</span>
          </div>
        </div>
      </div>
      <div className="row" style={{justifyContent:"flex-end"}}>
        <button className="button" onClick={async ()=>{ await api.patch("/v1/hvac/plant", cfg); alert("Plant config saved") }}>Save</button>
      </div>
    </div>
  )
}
