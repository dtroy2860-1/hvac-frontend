import React, { useState } from "react"
import { createProfile } from "../api"

export function ProfileForm({ onCreated }: { onCreated: ()=>void }) {
  const [name, setName] = useState("Office Standard v2")
  const [target, setTarget] = useState(23.0)
  const [min, setMin] = useState(21.0)
  const [max, setMax] = useState(25.0)
  const [n, setN] = useState(2)
  const [windowMin, setWindowMin] = useState(15)

  return (
    <div className="grid cols-3">
      <div className="card">
        <label>Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div className="card">
        <label>Target (°C)</label>
        <input className="input" type="number" step={0.1} value={target} onChange={e=>setTarget(parseFloat(e.target.value))} />
      </div>
      <div className="card">
        <label>Comfort Band (°C)</label>
        <div className="row">
          <input className="input" type="number" step={0.1} value={22.0} readOnly />
          <span>to</span>
          <input className="input" type="number" step={0.1} value={24.0} readOnly />
        </div>
        <small className="muted">Edit per space after applying</small>
      </div>
      <div className="card">
        <label>Per-Space Min/Max (°C)</label>
        <div className="row">
          <input className="input" type="number" step={0.1} value={min} onChange={e=>setMin(parseFloat(e.target.value))} />
          <span>to</span>
          <input className="input" type="number" step={0.1} value={max} onChange={e=>setMax(parseFloat(e.target.value))} />
        </div>
      </div>
      <div className="card">
        <label>Change Budget</label>
        <div className="row">
          <input className="input" type="number" min={0} value={n} onChange={(e)=>setN(parseInt(e.target.value||"0"))} />
          <input className="input" type="number" min={0} value={windowMin} onChange={(e)=>setWindowMin(parseInt(e.target.value||"0"))} />
          <span>changes / minutes</span>
        </div>
      </div>
      <div className="row" style={{alignItems:"end"}}>
        <button className="button" onClick={async ()=>{
          await createProfile({
            name,
            targets: { zone_temp_c: target },
            comfort: { zone_temp_c: { min: 22.0, max: 24.0 }, rh_pct: { min: 40, max: 60 } },
            iaq: { co2_ppm: { max: 900 }, pm25_ugm3: { max: 25 } },
            min_max: { zone_temp_c: { min, max } },
            step_caps: { zone_temp_c: 0.2 },
            roc_caps: { zone_temp_c_c_per_min: 0.1 },
            change_budget: { n, window_s: windowMin * 60 },
            schedule: { active: ["Mon-Fri 06:00-20:00"], timezone: "Asia/Dubai" }
          })
          onCreated()
        }}>Create Profile</button>
      </div>
    </div>
  )
}
