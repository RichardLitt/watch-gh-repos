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
  // TODO Does this have to be in here? Would be good if I could export the individual functions
  const gh = new Octokat({
    token: opts.token || process.env.GITHUB_OGN_TOKEN
  })

  function ignoreRepo (repo) {
    return Promise.resolve().then(() => {
      return gh.repos(`${repo}`).subscription.update({'ignored': true})
    }).then((data) => {
      console.log('Response from ignoring:', data)
      return statusWrapper('ignored', repo)
    }).catch((err) => {
      console.log('Ignoring error', err)
    })
  }

  function unwatchRepo (repo) {
    return Promise.resolve().then(() => {
      return gh.repos(`${repo}`).subscription.remove()
    }).then((data) => {
      console.log('Response from unwatching:', data)
      return statusWrapper('unwatched', repo)
    }).catch((err) => {
      console.log('Unwatching error', err)
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

  // TODO Check if the repository is a valid repository
  console.log('opts: ', opts);

  // Init function
  if (opts.org && opts.repo) {
    return new Error(`Specify either an org or a repo, not both.`)
  } else if (opts.org) {
    // Get all repositories
    return Promise.resolve(githubRepos(opts.org, {token: opts.token}))
      .each((data) => {
        return sortOpts(opts, data.full_name)
      })
      .catch((err) => {
        console.log('Unable to get GitHub repositories', err)
      })
  } else {
    sortOpts(opts)
  }

  function sortOpts (opts, repoName) {
    // Arbitrary order of preference, disallows multiple flags
    if (opts.i) {
      return ignoreRepo((repoName) ? repoName : opts.i)
    } else if (opts.u) {
      return unwatchRepo((repoName) ? repoName : opts.unwatch)
    } else {
      return watchRepo((repoName) ? repoName : opts.repo)
    }
  }

}
