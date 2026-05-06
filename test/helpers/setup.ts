import { toContainGraph } from '../custom-matchers/toContainGraph'
import { toEqualGraph } from '../custom-matchers/toEqualGraph'
import { error, log, trace, warn } from 'solid-ui-core/debug'
import 'isomorphic-fetch'
import { TextEncoder, TextDecoder } from 'util'

const nodeCrypto = require('crypto')
global.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer)
  }
}

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

jest.mock('solid-ui-core/debug')

export function silenceDebugMessages () {
  ;(log as any).mockImplementation(() => null)
  ;(warn as any).mockImplementation(() => null)
  ;(error as any).mockImplementation(() => null)
  ;(trace as any).mockImplementation(() => null)
}

expect.extend({
  toContainGraph,
  toEqualGraph
})
