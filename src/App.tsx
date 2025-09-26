import React, { useState } from "react"
import { SpacesPage } from "./pages/Spaces"
import { ProfilesPage } from "./pages/Profiles"
import { OverviewPage } from "./pages/Overview"
import { PlantPage } from "./pages/Plant"

type Tab = "overview" | "spaces" | "profiles" | "plant"

export default function App() {
  const [tab, setTab] = useState<Tab>("spaces")
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>HVAC Optimizer</h1>
        <div className="nav">
          <a className={tab==="overview"?"active":""} onClick={()=>setTab("overview")}>Overview</a>
          <a className={tab==="spaces"?"active":""} onClick={()=>setTab("spaces")}>Spaces</a>
          <a className={tab==="profiles"?"active":""} onClick={()=>setTab("profiles")}>Profiles</a>
          <a className={tab==="plant"?"active":""} onClick={()=>setTab("plant")}>Plant</a>
        </div>
        <hr/>
        <small className="muted">Demo UI • FastAPI on :8000</small>
      </aside>
      <main className="main">
        {tab==="overview" && <OverviewPage/>}
        {tab==="spaces" && <SpacesPage/>}
        {tab==="profiles" && <ProfilesPage/>}
        {tab==="plant" && <PlantPage/>}
      </main>
    </div>
  )
}
