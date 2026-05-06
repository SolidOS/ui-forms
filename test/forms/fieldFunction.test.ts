import { silenceDebugMessages } from '../helpers/setup'

// @ts-ignore
import {
  mostSpecificClassURI
} from 'ui-forms'

import { // trying to import this way lead to bizarre chaos
// field,
// fieldFunction,
// mostSpecificClassURI
} from 'ui-forms/fieldFunction'
import { clearStore } from '../helpers/clearStore'

silenceDebugMessages()
afterEach(clearStore)

describe('mostSpecificClassURI', () => {
  it('exists', () => {
    expect(mostSpecificClassURI).toBeInstanceOf(Function)
  })
  /*
  it('reports the RDF type if there is only one', () => {
    const form = namedNode('http://example.com/#form')
    solidLogicSingleton.store.add(form, ns.rdf('type'), namedNode('http://example.com/#type'), namedNode('http://example.com/'))
    expect(mostSpecificClassURI(form)).toEqual('http://example.com/#type')
  })
  it('reports the subtype if there are one super and one sub type', () => {
    const node = namedNode('http://example.com/#form')
    solidLogicSingleton.store.add(node, ns.rdf('type'), namedNode('http://example.com/#human'), namedNode('http://example.com/'))
    solidLogicSingleton.store.add(node, ns.rdf('type'), namedNode('http://example.com/#employee'), namedNode('http://example.com/'))
    solidLogicSingleton.store.add(namedNode('http://example.com/#employee'), ns.rdfs('subClassOf'), namedNode('http://example.com/#human'), namedNode('http://example.com/'))
    expect(mostSpecificClassURI(node)).toEqual('http://example.com/#employee')
  })
  */
})
