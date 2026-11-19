import test from 'node:test'
import assert from 'node:assert/strict'
import { articles, resources, playbookSourceAliases } from '../src/data.ts'
import { playbookCatalog } from '../src/playbook/catalog.ts'
import { drills, formations, scenarios } from '../src/playbook/data.ts'
import type { BoardAction, BoardState, Point } from '../src/playbook/types.ts'

const teamA = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6']
const sourceIds = new Set(resources.map(source => source.id))
const articleIds = new Set(articles.map(article => article.id))
const drillIds = new Set(drills.map(drill => drill.id))
const scenarioIds = new Set(scenarios.map(scenario => scenario.id))

function uniqueIds(records: { id: string }[], label: string) {
  assert.equal(new Set(records.map(record => record.id)).size, records.length, `${label}: duplicate IDs`)
}
function point(position: Point, label: string) {
  for (const axis of ['x', 'y'] as const) {
    assert.ok(Number.isFinite(position[axis]) && position[axis] >= 0 && position[axis] <= 100,
      `${label}: ${axis} must be a finite normalized coordinate, received ${position[axis]}`)
  }
}
function snapshot(state: BoardState, label: string) {
  uniqueIds(state.players, label)
  assert.deepEqual(state.players.filter(player => player.team === 'A').map(player => player.id).sort(), teamA, `${label}: six consistent Team A roles`)
  for (const player of state.players) {
    assert.ok(['A', 'B'].includes(player.team), `${label}: unknown team`)
    assert.ok(['available', 'surface'].includes(player.availability), `${label}: an active frame must state player availability`)
    point(player.position, `${label}/${player.id}`)
  }
  point(state.puck.position, `${label}/puck`)
  if (state.puck.carrierId !== null) {
    const carrier = state.players.find(player => player.id === state.puck.carrierId)
    assert.ok(carrier, `${label}: unknown carrier`)
    assert.equal(carrier.availability, 'available', `${label}: surface player cannot control the underwater puck`)
    assert.deepEqual(state.puck.position, carrier.position, `${label}: schematic carrier/puck positions differ`)
  }
}

// Replay only the source catalog's documented action semantics. Comparing every resulting
// snapshot catches unrecorded movement, stale arrows, unexplained possession or depth changes.
function replay(state: BoardState, actions: BoardAction[], label: string): BoardState {
  const next = structuredClone(state)
  assert.deepEqual(actions.map(action => action.order), actions.map((_, index) => index + 1), `${label}: actions must be ordered and contiguous`)
  for (const action of actions) {
    const at = `${label}/action-${action.order}/${action.kind}`
    const actor = next.players.find(player => player.id === action.actorId)
    assert.ok(actor, `${at}: actor not in preceding frame`)
    assert.ok(action.path.length >= 2, `${at}: path needs start and end`)
    action.path.forEach((position, index) => point(position, `${at}/point-${index}`))
    const start = action.path[0]
    const end = action.path[action.path.length - 1]
    assert.deepEqual(start, actor.position, `${at}: path must start at actor's current position`)
    if (action.kind !== 'available') assert.equal(actor.availability, 'available', `${at}: unavailable actor participates underwater`)

    switch (action.kind) {
      case 'move':
        assert.notEqual(next.puck.carrierId, actor.id, `${at}: carrier movement must be encoded as carry`)
        actor.position = { ...end }
        break
      case 'carry':
        assert.equal(next.puck.carrierId, actor.id, `${at}: only carrier may carry`)
        assert.deepEqual(start, next.puck.position, `${at}: carry starts without puck`)
        actor.position = { ...end }
        next.puck.position = { ...end }
        break
      case 'pass': {
        assert.equal(next.puck.carrierId, actor.id, `${at}: passer must possess puck`)
        assert.equal(action.objectId, 'puck', `${at}: pass must move puck`)
        assert.deepEqual(start, next.puck.position, `${at}: pass must start at puck`)
        const receiver = next.players.find(player => player.id === action.targetActorId)
        assert.ok(receiver, `${at}: unknown receiver`)
        assert.notEqual(receiver.id, actor.id, `${at}: self-pass target`)
        assert.equal(receiver.team, actor.team, `${at}: a pass cannot silently change team possession`)
        assert.equal(receiver.availability, 'available', `${at}: pass targets a surface/unavailable player`)
        assert.deepEqual(end, receiver.position, `${at}: pass endpoint is not receiver's current position`)
        next.puck.position = { ...end }
        next.puck.carrierId = receiver.id
        break
      }
      case 'recover':
        assert.equal(action.objectId, 'puck', `${at}: recovery must identify puck`)
        assert.equal(action.previousCarrierId, next.puck.carrierId, `${at}: recovery must identify actual former carrier`)
        assert.notEqual(actor.id, next.puck.carrierId, `${at}: recovery requires a possession change`)
        assert.deepEqual(end, next.puck.position, `${at}: recovery must reach puck's current position`)
        actor.position = { ...end }
        next.puck.carrierId = actor.id
        break
      case 'surface':
        assert.notEqual(next.puck.carrierId, actor.id, `${at}: release puck before surfacing in the illustrated state`)
        assert.equal(action.endAvailability, 'surface', `${at}: wrong availability transition`)
        assert.ok(action.path.every(position => position.x === start.x && position.y === start.y), `${at}: surfacing is not an unexplained horizontal route`)
        actor.availability = 'surface'
        break
      case 'available':
        assert.equal(action.endAvailability, 'available', `${at}: wrong availability transition`)
        assert.ok(action.path.every(position => position.x === start.x && position.y === start.y), `${at}: availability change must not teleport actor`)
        actor.availability = 'available'
        break
      case 'hold':
        assert.ok(action.path.every(position => position.x === start.x && position.y === start.y), `${at}: hold must not move actor`)
        break
      default:
        assert.fail(`${at}: unrecognized action kind`)
    }
    snapshot(next, at)
  }
  return next
}

test('complete playbook import preserves every formation, sequence, drill and source observation', () => {
  assert.deepEqual({ formations: formations.length, sequences: scenarios.length, sequenceSteps: scenarios.reduce((total, item) => total + item.steps.length, 0), drills: drills.length }, playbookCatalog.meta.counts)
  for (const records of [formations, scenarios, drills]) uniqueIds(records, 'playbook catalog')
  for (const [raw, imported] of [[playbookCatalog.formations, formations], [playbookCatalog.sequences, scenarios], [playbookCatalog.drills, drills]] as const) {
    assert.deepEqual(imported.map(item => item.id), raw.map(item => item.id))
    for (const original of raw) {
      const converted = imported.find(item => item.id === original.id)!
      for (const key of Object.keys(original) as (keyof typeof original)[]) {
        if (key === 'sourceIds') assert.deepEqual(converted.sourceIds, original.sourceIds.map(id => playbookSourceAliases[id]), original.id)
        else assert.deepEqual(converted[key as keyof typeof converted], original[key], `${original.id}: lost original field ${key}`)
      }
    }
  }
  for (const source of playbookCatalog.sources) {
    const resource = resources.find(item => item.id === playbookSourceAliases[source.id])
    assert.ok(resource, `missing source alias ${source.id}`)
    assert.ok(resource.sourceRecords?.some(record => {
      try { assert.deepEqual(record, { catalog: 'playbook-expansion', ...source }); return true }
      catch { return false }
    }), `${source.id}: source observation was reduced or dropped`)
  }
})

test('formation references preserve six roles without implying simultaneous underwater availability', () => {
  for (const formation of formations) {
    const players = formation.referenceState.players
    assert.equal(formation.playerCount, 6, formation.id)
    assert.equal(players.length, 6, formation.id)
    uniqueIds(players, formation.id)
    assert.deepEqual(players.map(player => player.id).sort(), teamA, formation.id)
    assert.deepEqual(formation.roleResponsibilities.map(role => role.actorId).sort(), teamA, `${formation.id}: responsibilities must cover each role once`)
    for (const player of players) {
      assert.equal(player.team, 'A', formation.id)
      assert.equal(player.availability, 'reference', `${formation.id}: formation is a role map`)
      point(player.position, `${formation.id}/${player.id}`)
    }
    assert.ok(formation.textAlternative && formation.sourceRelationship, `${formation.id}: interpretation and text alternative required`)
  }
})

test('all 36 decision snapshots replay from ordered action paths without state discontinuities', () => {
  const formationIds = new Set(formations.map(formation => formation.id))
  const allSteps = scenarios.flatMap(scenario => scenario.steps)
  uniqueIds(allSteps, 'all sequence steps')
  for (const scenario of scenarios) {
    assert.ok(formationIds.has(scenario.formationId), `${scenario.id}: missing formation`)
    assert.equal(scenario.attackDirection, 'A toward y=0; B toward y=100', `${scenario.id}: team direction must not flip on turnover`)
    assert.deepEqual(scenario.steps.map(step => step.number), scenario.steps.map((_, index) => index + 1), `${scenario.id}: step order`)
    let state = scenario.initialState
    snapshot(state, `${scenario.id}/initial`)
    for (const step of scenario.steps) {
      assert.ok(step.readCue && step.ifUnavailableOrClosed && step.coachObservable && step.textAlternative, `${step.id}: missing decision or accessibility context`)
      const result = replay(state, step.actions, step.id)
      snapshot(step.state, step.id)
      assert.deepEqual(result, step.state, `${step.id}: action replay must exactly reproduce complete resulting state`)
      state = step.state
    }
  }
})

test('source, article, drill and reverse scenario links resolve to real local content', () => {
  for (const item of [...formations, ...scenarios, ...drills]) {
    assert.ok(item.sourceIds.length > 0, `${item.id}: no source context`)
    for (const id of item.sourceIds) assert.ok(sourceIds.has(id), `${item.id}: missing source ${id}`)
  }
  for (const item of [...scenarios, ...drills]) {
    assert.ok(item.articleIds.length > 0, `${item.id}: disconnected lesson`)
    for (const id of item.articleIds) assert.ok(articleIds.has(id), `${item.id}: missing article ${id}`)
  }
  for (const scenario of scenarios) {
    assert.ok(scenario.drillIds.length > 0, `${scenario.id}: no linked practice`)
    for (const id of scenario.drillIds) {
      assert.ok(drillIds.has(id), `${scenario.id}: missing drill ${id}`)
      assert.ok(drills.find(drill => drill.id === id)!.scenarioIds.includes(scenario.id), `${scenario.id}/${id}: missing return link`)
    }
  }
  for (const drill of drills) {
    for (const id of drill.scenarioIds) {
      assert.ok(scenarioIds.has(id), `${drill.id}: missing scenario ${id}`)
      assert.ok(scenarios.find(scenario => scenario.id === id)!.drillIds.includes(drill.id), `${drill.id}/${id}: unrelated return link`)
    }
    assert.ok(drill.setup.length && drill.procedure.length && drill.resetAndRotation.length && drill.coachObservations.length && drill.debriefQuestions.length, `${drill.id}: incomplete standalone practice`)
    assert.ok(drill.safety && drill.sourceNote, `${drill.id}: missing safety or source limits`)
  }
})
