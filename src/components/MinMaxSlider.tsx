import React, { useState } from "react"
export function MinMaxSlider({ min, max, onChange }: { min: number; max: number; onChange: (min:number,max:number)=>void }) {
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)
  const clamp = (v: number) => Math.min(30, Math.max(10, v))
  const commit = () => onChange(localMin, localMax)
  return (
    <div className="row" style={{gap:12, alignItems:"center"}}>
      <input className="input" type="number" step={0.1} value={localMin} onChange={e=>setLocalMin(clamp(parseFloat(e.target.value)))} onBlur={commit} />
      <input className="input" type="range" min="10" max="30" step="0.1" value={localMin} onChange={(e)=>setLocalMin(parseFloat(e.target.value))} onMouseUp={commit}/>
      <div>—</div>
      <input className="input" type="range" min="10" max="30" step="0.1" value={localMax} onChange={(e)=>setLocalMax(parseFloat(e.target.value))} onMouseUp={commit}/>
      <input className="input" type="number" step={0.1} value={localMax} onChange={e=>setLocalMax(clamp(parseFloat(e.target.value)))} onBlur={commit} />
    </div>
  )
}
