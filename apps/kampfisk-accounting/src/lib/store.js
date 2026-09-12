const STORAGE_KEY = 'kampfisk-accounting:v1'

const initialState = {
  company: {
    name: 'KampfiskApps',
    organizationNumber: '',
    vatRegistered: false,
  },
  vouchers: [],
  deadlines: [],
  auditLog: [],
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(initialState)
    return { ...structuredClone(initialState), ...JSON.parse(raw) }
  } catch {
    return structuredClone(initialState)
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY)
  return structuredClone(initialState)
}

export function audit(action, details = {}) {
  return {
    id: crypto.randomUUID(),
    action,
    details,
    at: new Date().toISOString(),
  }
}
