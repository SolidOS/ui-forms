/* Test the autocomplete field in the form system
*/

import { getFileContent } from '../../helpers/getFileContent'
import { parse } from 'rdflib'
import {
  autocompleteField
} from 'ui-forms/autocomplete/autocompleteField'
import ns from 'solid-ui-core/ns'
import { store } from 'solid-logic'
import {
  findByTestId,
  waitFor
} from '@testing-library/dom'
import nock from 'nock'

jest.unmock('rdflib') // we need Fetcher to work (mocked)
jest.unmock('debug') // while debugging only @@

const turtleResponseHeaders = {
  Vary: 'Accept, Authorization, Origin',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers': 'Authorization, User, Location, Link, Vary, Last-Modified, ETag, Accept-Patch, Accept-Post, Updates-Via, Allow, WAC-Allow, Content-Length, WWW-Authenticate, MS-Author-Via',
  Allow: 'OPTIONS, HEAD, GET, PATCH, POST, PUT, DELETE',
  'WAC-Allow': 'user="read write",public="read',
  'MS-Author-Via': 'SPARQL',
  'Content-Type': 'text/turtle; charset=utf-8'
}

const prefixes = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix ui: <http://www.w3.org/ns/ui#>.
@prefix schema: <http://schema.org/>.
@prefix vcard: <http://www.w3.org/2006/vcard/ns#>.

@prefix org: <http://www.w3.org/ns/org#>.
@prefix esco: <http://data.europa.eu/esco/model#>.
@prefix wd: <http://www.wikidata.org/entity/>.
@prefix wdt: <http://www.wikidata.org/prop/direct/>.

@prefix : <#>.
`
const formText = prefixes + `

      :CorporationAutocomplete a ui:AutocompleteField;
      a ui:AutocompleteField; ui:label "Corporation in wikidata";
           ui:size 60;
           ui:targetClass  <http://www.wikidata.org/entity/Q6881511>; # Enterprise
           ui:property solid:publicId; ui:dataSource :WikidataInstancesByName.

      :WikidataInstancesByName a ui:DataSource ;
        schema:name "Wikidata instances by name";
        ui:endpoint "https://query.wikidata.org/sparql" ;
        ui:searchByNameQuery """SELECT ?subject ?name
        WHERE {
          ?klass wdt:P279* $(targetClass) .
          ?subject wdt:P31 ?klass .
          ?subject rdfs:label ?name.
          FILTER regex(?name, "$(name)", "i")
        } LIMIT $(limit) """.
  `

const initialDataText = prefixes + `
<#Alice> solid:publicId  wd:Q12345 .
wd:Q12345 schema:name "test institution" .

`

const kb = store

const form = kb.sym('https://example.org/forms.ttl#CorporationAutocomplete')
const subject = kb.sym('https://example.org/data.ttl#Alice')
const predicate = ns.solid('publicId')

parse(formText, store, form.doc().uri)
parse(initialDataText, store, subject.doc().uri)

async function wait (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

describe('autocompleteField', () => {
  let result
  beforeEach(() => {
  })

  it('exists as a function', () => {
    expect(autocompleteField).toBeInstanceOf(Function)
  })
  it('creates a autocomplete field', async () => {
    const container = undefined
    const already = {}
    const callbackFunction = () => {}

    result = autocompleteField(
      document,
      container as HTMLElement | undefined,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )

    const inputElement = await findByTestId(result, 'autocomplete-input')
    expect(inputElement.tagName).toEqual('INPUT')
    expect(result).toMatchSnapshot()
  })

  it('adds the autocomplete field to the container, if provided', () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}

    result = autocompleteField(
      document,
      container as HTMLElement | undefined,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )
    expect(container).toMatchSnapshot()
  })

  it('has an accept button which is hidden', async () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}

    result = autocompleteField(
      document,
      container as HTMLElement | undefined,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )
    const acceptButton = await findByTestId(result, 'accept-button')
    expect(acceptButton.style.display).toEqual('none')
    const cancelButton = await findByTestId(result, 'cancel-button')
    expect(cancelButton.style.display).toEqual('none')
    const editButton = await findByTestId(result, 'edit-button')
    expect(editButton.style.display).toEqual('none')
  })

  it('has an input element which has the initial value', async () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}

    result = autocompleteField(
      document,
      container as HTMLElement | undefined,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )

    const inputElement = await findByTestId(result, 'autocomplete-input')
    expect(inputElement.value).toEqual('test institution')
  })

  it('makes Cancel button appear when user inputs something', async () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}

    result = autocompleteField(
      document,
      container,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )
    const inputElement = await findByTestId(result, 'autocomplete-input') as HTMLInputElement

    inputElement.value = 'mass'

    const event1 = new Event('input')
    inputElement.dispatchEvent(event1)

    const cancelButton = await findByTestId(result, 'cancel-button')
    expect(cancelButton.style.display).toEqual('') // Visible again
  })

  it('makes Cancel button work when user inputs something', async () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}

    result = autocompleteField(
      document,
      container,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )
    const inputElement = await findByTestId(result, 'autocomplete-input') as HTMLInputElement

    inputElement.value = 'mass'

    const event1 = new Event('input')
    inputElement.dispatchEvent(event1)

    const cancelButton = await findByTestId(result, 'cancel-button')
    expect(cancelButton.style.display).toEqual('') // Visible again

    const event2 = new Event('click')
    cancelButton.dispatchEvent(event2)
    await wait(300)
    expect(inputElement.value).toEqual('test institution') // restored
    expect(cancelButton.style.display).toEqual('none') // invisible again
  })

  it('on input fetches data (fixing wikidata timeout issue) making green table', async () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}

    result = autocompleteField(
      document,
      container,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )
    const inputElement = await findByTestId(result, 'autocomplete-input') as HTMLInputElement
    const fakeResponse = await getFileContent('test/forms/autocomplete/broken-sparql-response-small.txt')

    nock('https://query.wikidata.org')
      .get(/^\/sparql/)
      .reply(200, fakeResponse)

    inputElement.value = 'mass'

    const event1 = new Event('input')
    inputElement.dispatchEvent(event1)

    const table = await findByTestId(result, 'autocomplete-table')
    await waitFor(() => expect(table.children.length).toEqual(4))
    expect(table.children.length).toBeGreaterThan(1)
    expect(table).toMatchSnapshot()
    expect(table.children[1].style.color).toEqual('rgb(0, 136, 0)') // green as all loaded
  })

  it('typing more search term till unique selects the whole name and sets the accept button active', async () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}
    const CHOSEN_NAME = 'abbazia di San Massimino'
    result = autocompleteField(
      document,
      container,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )
    const inputElement = await findByTestId(result, 'autocomplete-input') as HTMLInputElement
    const fakeResponse = await getFileContent('test/forms/autocomplete/broken-sparql-response-small.txt')

    nock('https://query.wikidata.org')
      .get(/^\/sparql/)
      .reply(200, fakeResponse)

    inputElement.value = 'mass'

    const event1 = new Event('input')
    inputElement.dispatchEvent(event1)

    const table = await findByTestId(result, 'autocomplete-table')
    await waitFor(() => expect(table.children.length).toEqual(4))

    inputElement.value = 'massim' // add extra characters to make it unique

    inputElement.dispatchEvent(new Event('input'))

    await wait(1000)

    expect(table.children.length).toEqual(1)
    await findByTestId(result, 'autocomplete-input')

    expect(inputElement.value).toEqual(CHOSEN_NAME)
    expect(result).toMatchSnapshot()

    const acceptButton = await findByTestId(result, 'accept-button')
    expect(acceptButton.style.display).toEqual('') // should be visible
  })

  it('clicking on row of green table then accept button saves data', async () => {
    const container = document.createElement('div')
    const already = {}
    const callbackFunction = () => {}
    const CHOSEN_NAME = 'abbazia di San Massimino'
    result = autocompleteField(
      document,
      container,
      already,
      subject,
      form,
      subject.doc(),
      callbackFunction
    )
    const inputElement = await findByTestId(result, 'autocomplete-input') as HTMLInputElement
    const fakeResponse = await getFileContent('test/forms/autocomplete/broken-sparql-response-small.txt')

    nock('https://query.wikidata.org')
      .get(/^\/sparql/)
      .reply(200, fakeResponse)

    inputElement.value = 'mass'

    const event1 = new Event('input')
    inputElement.dispatchEvent(event1)

    const table = await findByTestId(result, 'autocomplete-table')
    await waitFor(() => expect(table.children.length).toEqual(4))
    let row
    for (let i = 0; i < table.children.length; i++) {
      if (table.children[i].textContent.includes(CHOSEN_NAME)) {
        row = table.children[i]
      }
    }
    expect(row).not.toEqual(undefined)
    const clickEvent = new Event('click')
    row.dispatchEvent(clickEvent)

    await wait(1000)

    expect(table.children.length).toEqual(1)
    await findByTestId(result, 'autocomplete-input')

    expect(result).toMatchSnapshot()

    const acceptButton = await findByTestId(result, 'accept-button')
    expect(acceptButton.style.display).toEqual('') // should be visible

    nock(subject.site().uri)
      .defaultReplyHeaders(turtleResponseHeaders)
      .get('/data.ttl')
      .reply(200, initialDataText)

    await kb.fetcher.load(subject)

    nock(subject.site().uri)
      .intercept('/data.ttl', 'PATCH')
      .reply(200, 'ok')

    const clickEvent2 = new Event('click')
    acceptButton.dispatchEvent(clickEvent2)

    await wait(500)
    const obj = kb.any(subject, predicate, null, subject.doc())
    expect(obj.termType).toEqual('NamedNode')
    const name = kb.any(obj, ns.schema('name'), null, subject.doc())
    expect(name.termType).toEqual('Literal')
    expect(name.value).toEqual(CHOSEN_NAME)
  })
})
