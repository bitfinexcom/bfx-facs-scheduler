'use strict'

const test = require('brittle')

const Fac = require('../')

test('adds, removes, and stops scheduled jobs', function (t) {
  const caller = { ctx: { root: '' } }
  const fac = new Fac(caller, {}, {})
  const when = new Date(Date.now() + 60 * 60 * 1000)

  t.plan(7)

  fac.start((err) => {
    t.absent(err)

    fac.add('keep', () => {}, when)
    fac.add('drop', () => {}, when)
    fac.add('cron', () => {}, '0 0 1 1 *')
    t.ok(fac.mem.get('cron'))
    t.is(fac.mem.size, 3)

    fac.del('missing')
    fac.del('drop')
    t.absent(fac.mem.has('drop'))
    t.ok(fac.mem.has('keep'))

    fac.stop((stopErr) => {
      t.absent(stopErr)
      t.is(fac.mem.size, 0)
    })
  })
})
