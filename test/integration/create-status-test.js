require('../mocha-options')
const fixtures = require('@octokit/fixtures')
const GitHub = require('../../')

describe('api.github.com', () => {
  it('github.repos.createStatus()', () => {
    const GitHubMock = fixtures.mock('api.github.com/create-status')

    const github = new GitHub()

    github.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    return Promise.all([
      github.repos.createStatus({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        sha: '0000000000000000000000000000000000000001',
        state: 'failure',
        target_url: 'https://example.com',
        description: 'create-status failure test',
        context: 'example/1'
      }),
      github.repos.createStatus({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        sha: '0000000000000000000000000000000000000001',
        state: 'success',
        target_url: 'https://example.com',
        description: 'create-status success test',
        context: 'example/2'
      })
    ])

    .then(() => {
      return github.repos.getStatuses({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        ref: '0000000000000000000000000000000000000001'
      })
    })

    .then((response) => {
      expect(response.data.length).to.equal(2)

      return github.repos.getCombinedStatusForRef({
        owner: 'octokit-fixture-org',
        repo: 'create-status',
        ref: '0000000000000000000000000000000000000001'
      })
    })
    .then((response) => {
      expect(response.data.state).to.equal('failure')
      expect(GitHubMock.pending()).to.deep.equal([])
    })

    .catch(GitHubMock.explain)
  })
})
