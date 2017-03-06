const githubRepos = require('github-repositories')
const fs = require('fs')
const Promise = require('bluebird')
const _ = require('lodash')
const Octokat = require('octokat')

function statusWrapper (status, repo) {
  return [{
    status: status,
    repo: repo
  }]
}

module.exports = function sortFunctions (opts) {
  // TODO Throw error if wrong token specified
  const gh = new Octokat({
    token: opts.token || process.env.GITHUB_OGN_TOKEN
  })

  function unwatchRepo (repo) {
    return Promise.resolve(gh.fromUrl(`/repos/${repo}/subscription`).remove()).then((data) => {
      return statusWrapper('unwatched', repo)
    }).catch((err) => {
      return new Error(`Failed to unwatch ${repo}.`)
    })
  }

  function watchRepo (repo) {
    return Promise.resolve(gh.fromUrl(`/repos/${repo}/subscription`).create({subscribed: true})).then((data) => {
      // TODO Watching returns a 'message not found' request. Which shouldn't be happening.
      // This ought to go here, but it doesn't.
      return statusWrapper('watched', repo)
    }).catch((err) => {
      console.log('Currently unable to tell whether this has been watched or not.')
      console.log(repo)
      if (err.status === 404) {
        return statusWrapper('watched', repo)
      } else {
        return new Error(`Failed to watch ${repo}.`)
      }
    })
  }

  if (opts.org && opts.repo) {
    return new Error(`Specify either an org or a repo, not both.`)
  }

  // TODO Sort if an org or user was specified
  if (opts.org) {
    return Promise.resolve(githubRepos(opts.org, {token: opts.token}))
      .each((data) => {
        return (opts.u) ? unwatchRepo(data.full_name) : watchRepo(data.full_name)
      })
      .then((res) => {
        return []
      })
      .catch((err) => {
        console.log('Unable to get GitHub repositories', err)
      })
  }

  return (opts.u) ? unwatchRepo(opts.repo) : watchRepo(opts.repo)

  // This works at the moment

}
