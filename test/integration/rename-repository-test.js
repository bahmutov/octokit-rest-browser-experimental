require('../mocha-options')
const fixtures = require('@octokit/fixtures')
const GitHub = require('../../')

describe('api.github.com', () => {
  it('github.repos.get() with previous name', () => {
    const GitHubMock = fixtures.mock('api.github.com/rename-repository')

    const github = new GitHub()

    github.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    return github.repos.edit({
      owner: 'octokit-fixture-org',
      repo: 'rename-repository',
      name: 'rename-repository-newname',
      // TODO: remove once #587 is resolved
      headers: {
        accept: 'application/vnd.github.v3+json'
      }
    })

    .then(() => {
      return github.repos.get({
        owner: 'octokit-fixture-org',
        repo: 'rename-repository',
        // TODO: remove once #587 is resolved
        headers: {
          accept: 'application/vnd.github.v3+json'
        }
      })
    })

    .then(() => {
      return github.repos.edit({
        owner: 'octokit-fixture-org',
        repo: 'rename-repository',
        // TODO: remove once #587 is resolved
        headers: {
          accept: 'application/vnd.github.v3+json'
        },
        name: 'rename-repository-newname',
        description: 'test description'
      })
    })

    .then((response) => {
      expect(GitHubMock.pending()).to.deep.equal([])
    })

    .catch(GitHubMock.explain)
  })
})
