import axios from "axios"

export const API_BASE = "http://localhost:8000"
// export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000"
export const api = axios.create({ baseURL: API_BASE })

export type Mode = "shadow" | "supervised" | "autonomous"
export type Band = { min?: number; max?: number }
export type Comfort = { zone_temp_c: Band; rh_pct?: Band }
export type IAQ = { co2_ppm?: Band; pm25_ugm3?: Band }
export type MinMax = { zone_temp_c: Band }
export type ChangeBudget = { n: number; window_s: number }
export type Space = { id: string; name: string; groups: string[]; loop_mode: Mode; targets: Record<string, number>; comfort: Comfort; iaq: IAQ; min_max: MinMax; step_caps: Record<string, number>; change_budget: ChangeBudget; effective_bounds: MinMax; last_profile_applied?: string; }
export type Profile = { id: string; name: string; targets: Record<string, number>; comfort: Comfort; iaq: IAQ; min_max: MinMax; step_caps: Record<string, number>; roc_caps: Record<string, number>; change_budget: ChangeBudget; schedule: { active: string[]; timezone: string }; }
export async function fetchSpaces(): Promise<Space[]> { const { data } = await api.get("/v1/hvac/spaces"); return data }
export async function fetchSpace(id: string): Promise<Space> { const { data } = await api.get(`/v1/hvac/spaces/${id}`); return data }
export async function patchSpace(id: string, patch: Partial<Space>): Promise<Space> { const { data } = await api.patch(`/v1/hvac/spaces/${id}/config`, patch); return data }
export async function fetchProfiles(): Promise<Profile[]> { const { data } = await api.get("/v1/hvac/profiles"); return data }
export async function createProfile(p: Omit<Profile,"id"> & { name: string }): Promise<Profile> { const { data } = await api.post("/v1/hvac/profiles", p); return data }
export async function applyProfile(profile_id: string, space_ids: string[]) { const { data } = await api.post("/v1/hvac/spaces/bulk/apply-profile", { profile_id, space_ids }); return data }
export async function fetchSavings(space_ids?: string[]) { const param = space_ids?.length ? `?space_ids=${space_ids.join(",")}` : ""; const { data } = await api.get(`/v1/hvac/metrics/savings${param}`); return data as { space_id: string; kwh_saved: number; pct_saved: number; cost_saved: number; confidence: "low"|"medium"|"high" }[] }
