import React, { useEffect, useState } from "react"
import { Profile, fetchProfiles, applyProfile } from "../api"
import { ProfileForm } from "../components/ProfileForm"

export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const load = async () => setProfiles(await fetchProfiles())
  useEffect(()=>{ load() }, [])

  return (
    <div className="grid">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h2>Profiles</h2>
        <button className="button" onClick={load}>Refresh</button>
      </div>
      <div className="card grid" style={{gap:12}}>
        <table className="table">
          <thead><tr><th>Name</th><th>Target</th><th>Comfort</th><th>IAQ</th><th>Budget</th><th>Actions</th></tr></thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.targets.zone_temp_c} °C</td>
                <td>{p.comfort.zone_temp_c.min}–{p.comfort.zone_temp_c.max} °C</td>
                <td>CO₂ ≤ {p.iaq.co2_ppm?.max ?? "—"} ppm</td>
                <td>{p.change_budget.n} / {Math.round(p.change_budget.window_s/60)}m</td>
                <td>
                  <button className="button" onClick={async ()=>{
                    await applyProfile(p.id, [])
                    alert("Applied to all spaces (demo).")
                  }}>Apply to all spaces</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Create Profile</h3>
        <ProfileForm onCreated={load}/>
      </div>
    </div>
  )
}
