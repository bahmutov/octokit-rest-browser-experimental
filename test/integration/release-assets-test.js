require('../mocha-options')
const fixtures = require('@octokit/fixtures')
const stringToArrayBuffer = require('string-to-arraybuffer')
const GitHub = require('../../')

describe('api.github.com', () => {
  it('github.repos.*Assets', () => {
    const GitHubMock = fixtures.mock('api.github.com/release-assets')
    const githubUserA = new GitHub()

    var releaseId
    var assetId

    githubUserA.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    return githubUserA.repos.getReleaseByTag({
      owner: 'octokit-fixture-org',
      repo: 'release-assets',
      tag: 'v1.0.0'
    })

    .then(result => {
      releaseId = result.data.id

      return githubUserA.repos.uploadAsset({
        url: result.data.upload_url,
        file: 'Hello, world!\n',
        contentType: 'text/plain',
        contentLength: 14,
        name: 'test-upload.txt',
        label: 'test'
      })
    })

    .then(result => {
      assetId = releaseId

      return githubUserA.repos.getAssets({
        owner: 'octokit-fixture-org',
        repo: 'release-assets',
        id: releaseId
      })
    })

    .then(result => {
      return githubUserA.repos.getAsset({
        owner: 'octokit-fixture-org',
        repo: 'release-assets',
        id: assetId
      })
    })

    .then(result => {
      return githubUserA.repos.editAsset({
        owner: 'octokit-fixture-org',
        repo: 'release-assets',
        id: assetId,
        name: 'new-filename.txt',
        label: 'new label'
      })
    })

    .then(result => {
      return githubUserA.repos.deleteAsset({
        owner: 'octokit-fixture-org',
        repo: 'release-assets',
        id: assetId
      })
    })

    .then((result) => {
      expect(GitHubMock.pending()).to.deep.equal([])
    })

    .catch(GitHubMock.explain)
  })

  it('github.repos.uploadAsset as Buffer', () => {
    fixtures.mock('api.github.com/release-assets')
    const githubUserA = new GitHub()

    githubUserA.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    return githubUserA.repos.getReleaseByTag({
      owner: 'octokit-fixture-org',
      repo: 'release-assets',
      tag: 'v1.0.0'
    })

    .then(result => {
      const content = Buffer.from('Hello, world!\n')
      return githubUserA.repos.uploadAsset({
        url: result.data.upload_url,
        file: content,
        contentType: 'text/plain',
        contentLength: 14,
        name: 'test-upload.txt',
        label: 'test'
      })
    })
  })

  it('github.repos.uploadAsset as ArrayBuffer', () => {
    fixtures.mock('api.github.com/release-assets')
    const githubUserA = new GitHub()

    githubUserA.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    return githubUserA.repos.getReleaseByTag({
      owner: 'octokit-fixture-org',
      repo: 'release-assets',
      tag: 'v1.0.0'
    })

    .then(result => {
      const content = stringToArrayBuffer('Hello, world!\n')
      return githubUserA.repos.uploadAsset({
        url: result.data.upload_url,
        file: content,
        contentType: 'text/plain',
        contentLength: 14,
        name: 'test-upload.txt',
        label: 'test'
      })
    })
  })
})
