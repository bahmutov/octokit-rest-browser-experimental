require('../mocha-options')
const fixtures = require('@octokit/fixtures')
const GitHub = require('../../')

describe('api.github.com', () => {
  it('github.repos.createFile()', () => {
    const GitHubMock = fixtures.mock('api.github.com/create-file')

    const github = new GitHub()

    github.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    return github.repos.createFile({
      owner: 'octokit-fixture-org',
      repo: 'create-file',
      path: 'test.txt',
      message: 'create test.txt',
      content: Buffer.from('Test content').toString('base64')
    })

    .then((response) => {
      expect(response.data.content.type).to.equal('file')
      expect(GitHubMock.pending()).to.deep.equal([])
    })

    .catch(GitHubMock.explain)
  })
})
