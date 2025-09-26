import React, { useEffect, useState } from "react"
import { Space, fetchSpace, patchSpace } from "../api"
import { MinMaxSlider } from "./MinMaxSlider"

export function SpaceDetail({ spaceId, onClose, onUpdated }: { spaceId: string; onClose: ()=>void; onUpdated: ()=>void }) {
  const [space, setSpace] = useState<Space|null>(null)
  const [saving, setSaving] = useState(false)
  const [predictRes, setPredictRes] = useState<any>(null)
  const [predicting, setPredicting] = useState(false)

  const load = async () => setSpace(await fetchSpace(spaceId))
  useEffect(()=>{ load() }, [spaceId])

  const save = async () => {
    if (!space) return
    setSaving(true)
    await patchSpace(space.id, {
      targets: space.targets,
      min_max: space.min_max,
      step_caps: space.step_caps,
      change_budget: space.change_budget,
      comfort: space.comfort,
      iaq: space.iaq
    })
    setSaving(false)
    onUpdated()
  }

  const predict = async () => {
    setPredicting(true)
    try {
      const r = await fetch(`http://localhost:8000/v1/hvac/predict/${spaceId}`, { method: "POST" })
      // const r = await fetch(`${import.meta.env.VITE_API_BASE || "http://localhost:8000"}/v1/hvac/predict/${spaceId}`, { method: "POST" })
      const data = await r.json()
      setPredictRes(data)
    } finally {
      setPredicting(false)
    }
  }

  if (!space) return null
  const zmin = space.min_max.zone_temp_c.min ?? 21
  const zmax = space.min_max.zone_temp_c.max ?? 25

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="row" style={{justifyContent:"space-between"}}>
          <h3>{space.name}</h3>
          <button className="button ghost" onClick={onClose}>Close</button>
        </div>
        <hr/>

        <div className="grid cols-3">
          <div className="card">
            <div style={{marginBottom:8}}>Target (°C)</div>
            <input className="input" type="number" step={0.1}
              value={space.targets.zone_temp_c ?? 23}
              onChange={(e)=>setSpace({...space, targets: {...space.targets, zone_temp_c: parseFloat(e.target.value)}})}
            />
          </div>

          <div className="card">
            <div style={{marginBottom:8}}>Change Budget</div>
            <div className="row">
              <input className="input" type="number" min={0} value={space.change_budget.n}
                onChange={(e)=>setSpace({...space, change_budget: {...space.change_budget, n: parseInt(e.target.value||"0")}})} />
              <input className="input" type="number" min={0} value={Math.round(space.change_budget.window_s/60)}
                onChange={(e)=>setSpace({...space, change_budget: {...space.change_budget, window_s: parseInt(e.target.value||"0")*60}})} />
              <span>changes / minutes</span>
            </div>
          </div>

          <div className="card">
            <div style={{marginBottom:8}}>Step Cap (°C per change)</div>
            <input className="input" type="number" step={0.1}
              value={space.step_caps.zone_temp_c ?? 0.2}
              onChange={(e)=>setSpace({...space, step_caps: {...space.step_caps, zone_temp_c: parseFloat(e.target.value)}})}
            />
          </div>
        </div>

        <div className="card" style={{marginTop:12}}>
          <div style={{marginBottom:8}}>Per-Space Min/Max (°C)</div>
          <MinMaxSlider min={zmin} max={zmax} onChange={(min,max)=>setSpace({...space, min_max: { zone_temp_c: { min, max }}})} />
        </div>

        <div className="card" style={{marginTop:12}}>
          <div className="row" style={{justifyContent:"space-between"}}>
            <strong>Model Recommendation (Δu)</strong>
            <button className="button" onClick={predict} disabled={predicting}>{predicting?"Predicting…":"Predict"}</button>
          </div>
          {predictRes && (
            <div className="row" style={{gap:16}}>
              <div>Δu: <strong>{predictRes.recommendation.delta.toFixed(2)}</strong> °C</div>
              <div>Energy proxy: {predictRes.recommendation.terms.E_pred.toFixed(2)}</div>
              <div>Comfort risk: {(predictRes.recommendation.terms.comfort*100).toFixed(0)}%</div>
              <div>IAQ risk: {(predictRes.recommendation.terms.iaq*100).toFixed(0)}%</div>
            </div>
          )}
        </div>

        <div className="row" style={{justifyContent:"flex-end", gap:8, marginTop:12}}>
          <button className="button ghost" onClick={onClose}>Cancel</button>
          <button className="button" onClick={save} disabled={saving}>{saving?"Saving...":"Save changes"}</button>
        </div>
      </div>
    </div>
  )
}
