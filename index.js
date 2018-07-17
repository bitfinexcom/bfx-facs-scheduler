'use strict'

const _ = require('lodash')
const schedule = require('node-schedule')
const Base = require('bfx-facs-base')

class Scheduler extends Base {

  constructor(caller, opts, ctx) {
    super(caller, opts, ctx)
    
    this.name = 'scheduler'

    this.init()
  }

  init() {
    this.mem = new Map()
  }

  add(k, f, w) {
    this.mem.set(k, schedule.scheduleJob(w, f))
  }

  del(k) {
    const s = this.mem.get(k)
    if (!s) return
    s.cancel()
    this.mem.delete(k)
  }

  _stop(cb) {
    _.each(Array.from(this.mem.keys()), k => this.del(k))
    cb()
  }
}

module.exports = Scheduler
