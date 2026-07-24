/** Session-scoped dashboard animation / bootstrap flags (survives route changes, resets on logout). */

let bootstrapped = false
let initialAnimPending = true

export function isDashboardBootstrapped() {
  return bootstrapped
}

export function markDashboardBootstrapped() {
  bootstrapped = true
}

/** Returns true only once per login session — first time stats mount should count up from 0. */
export function consumeInitialAnim() {
  if (!initialAnimPending) return false
  initialAnimPending = false
  return true
}

export function resetDashboardSession() {
  bootstrapped = false
  initialAnimPending = true
}

/** Test helper */
export function __getDashboardSessionState() {
  return { bootstrapped, initialAnimPending }
}
