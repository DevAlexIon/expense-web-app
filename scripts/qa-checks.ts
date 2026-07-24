/**
 * Lightweight QA suite for session animation helpers.
 * Run: npm run qa
 */
import process from 'node:process'
import {
  __getDashboardSessionState,
  consumeInitialAnim,
  isDashboardBootstrapped,
  markDashboardBootstrapped,
  resetDashboardSession,
} from '../src/helpers/dashboardSession.ts'

let passed = 0
let failed = 0

function assert(name: string, condition: boolean) {
  if (condition) {
    passed += 1
    console.log(`  ✓ ${name}`)
  } else {
    failed += 1
    console.error(`  ✗ ${name}`)
  }
}

console.log('\nQA — dashboard session animation\n')

resetDashboardSession()
assert('starts not bootstrapped', isDashboardBootstrapped() === false)
assert('first consumeInitialAnim = true', consumeInitialAnim() === true)
assert(
  'second consumeInitialAnim = false (route remount)',
  consumeInitialAnim() === false,
)
assert('third still false', consumeInitialAnim() === false)

markDashboardBootstrapped()
assert('marked bootstrapped', isDashboardBootstrapped() === true)

resetDashboardSession()
assert('logout resets bootstrap', isDashboardBootstrapped() === false)
assert('logout restores initial anim', consumeInitialAnim() === true)
assert('state shape ok', (() => {
  const s = __getDashboardSessionState()
  return s.bootstrapped === false && s.initialAnimPending === false
})())

resetDashboardSession()
markDashboardBootstrapped()
consumeInitialAnim()
assert(
  'after bootstrap+consume, remount has no anim',
  consumeInitialAnim() === false && isDashboardBootstrapped() === true,
)

console.log(`\nResults: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
