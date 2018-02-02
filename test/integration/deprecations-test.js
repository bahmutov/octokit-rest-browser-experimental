const GitHub = require('../../')
const nock = require('nock')
const haveCypress = () =>
  typeof Cypress === 'object'
// not necessary in Cypress, but does not break
const chai = require('chai')
const expect = chai.expect
// const simple = require('simple-mock')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

// const mocha = require('mocha')
// describe = mocha.describe
// it = mocha.it
// beforeEach = mocha.beforeEach
// afterEach = mocha.afterEach

/* eslint-env mocha */
/* global cy */
/* eslint-disable no-unused-expressions */
describe.only('deprecations', () => {
  if (haveCypress()) {
    beforeEach(() => {
      cy.stub(console, 'warn')
    })
  } else {
    beforeEach(() => {
      sinon.stub(console, 'warn')
    })
    afterEach(() => {
      console.warn.restore()
    })
  }

  it('github.integrations.*', (done) => {
    nock('https://deprecations-test.com')
      .get('/app/installations')
      .reply(200, [])

    const github = new GitHub({
      host: 'deprecations-test.com'
    })
    github.integrations.getInstallations({})
    .then(() => {
      // chai-expect is built into Cypress
      // so this syntax is easier to have in Node and browser
      expect(console.warn).to.be.calledTwice
    }).then(done)
  })

  it('deprecated followRedirects option', () => {
    GitHub({
      followRedirects: false
    })
    expect(console.warn).to.be.calledOnce
  })

  it('deprecated Promise option', () => {
    GitHub({
      Promise: {}
    })
    expect(console.warn).to.be.calledOnce
  })
})
