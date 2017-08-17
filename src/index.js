const githubRepos = require('github-repositories')
const getGithubUser = require('get-github-user')
const fs = require('fs')
const Promise = require('bluebird')
const _ = require('lodash')
const Octokat = require('octokat')

module.exports = function sortFunctions (opts) {
  var token = (opts.enterprise) ? (opts.token || process.env.WATCH_GH_REPOS_ENTERPRISE) : (opts.token || process.env.WATCH_GH_REPOS)

  if (opts.enterprise && typeof opts.enterprise === 'boolean') {
    opts.enterprise = process.env.GITHUB_ENDPOINT
  }

  var validOpts = null

  // TODO Throw error if wrong token specified
  // TODO Does this have to be in here? Would be good if I could export the individual functions
  const gh = new Octokat({
    token: token,
    rootURL: opts.enterprise
  })

  // Could probably be extracted into it's own module
  function isGitHubRepo(repo) {
    if (opts.ratelimit) {
      return repo
    }
    return gh.repos(repo).fetch()
    .then((data) => data.fullName)
    .catch((err) => {
      throw new Error(`${repo} is not a valid GitHub repo!`)
    })
  }

  function getRepo (repo) {
    return Promise.resolve(isGitHubRepo(repo))
    .then((repo) => gh.repos(repo).subscription.fetch())
    .catch((err) => {
      throw new Error('Unable to get repo statistics')
    })
  }

  function ignoreRepo (repo) {
    return Promise.resolve(isGitHubRepo(repo))
    .then((repo) => gh.repos(repo).subscription.add({'ignored': true}))
    .then((data) => {
      if (data.ignored) {
        return `Ignored: ${repo}`
      } else {
        throw new Error('API failed to return appropriate response.')
      }
    }).catch((err) => {
      console.log('Ignoring error', err)
    })
  }

  function unwatchRepo (repo) {
    return Promise.resolve(isGitHubRepo(repo))
    .then((repo) => gh.repos(repo).subscription.remove())
    .then((data) => {
      if (data) {
        return `Unwatched: ${repo}`
      } else {
        throw new Error('API failed to return appropriate response.')
      }
    }).catch((err) => {
      throw new Error('Unwatching error', err)
    })
  }

  function watchRepo (repo) {
    return Promise.resolve(isGitHubRepo(repo))
    .then((repo) => {
      console.log(repo.split('/')[0], repo.split('/')[1])
      return gh.repos(repo.split('/')[0], repo.split('/')[1]).subscription.fetch()//.add({'subscribed': true})
    })
    .then((data) => {
      console.log('Done', data)
       if (data.subscribed) {
         return `Watched: ${repo}`
       } else {
         throw new Error('API failed to return appropriate response.')
       }
    }).catch((err) => {
      throw new Error(`Failed to watch ${repo}.`, err)
    })
  }

  function checkDupeOps (opts) {
    var val = []
    var optNames = ['i', 'w', 'u', 'g']
    for (var i = 0; i < optNames.length; i++) {
      if (opts[optNames[i]]) val.push(opts[optNames[i]])
    }
    if (val.length >= 2) {
      throw new Error("Cannot specify more than one state!")
    }
    validOpts = true
    return val[0]
  }

  function sortOpts (opts, repoName) {
    // Check just once that the opts don't have multiples
    if (!validOpts) { checkDupeOps(opts) }

    // Semi-arbitrary order of preference, disallows multiple flags
    if (opts.i) {
      return ignoreRepo((repoName) ? repoName : opts.ignore)
    } else if (opts.u) {
      return unwatchRepo((repoName) ? repoName : opts.unwatch)
    } else if (opts.w) {
      return watchRepo((repoName) ? repoName : opts.watch)
    } else {
      return getRepo((repoName) ? repoName : opts.get)
    }
  }

  // Init function
  if (opts.org) {
    // Figure out where to grab the key from
    var val = checkDupeOps(opts)
    // Get all repositories
    return Promise.resolve(getGithubUser(val))
      .then((data) => {
        if (data.length === 0) {
          throw new Error("Not a valid GitHub user")
        }
        return
      })
      .then(() => githubRepos(val, {token: token, endpoint: opts.enterprise}))
      .map((data) => {
        return sortOpts(opts, data.full_name)
      })
      .catch((err) => {
        console.log('Unable to get GitHub repositories', err)
      })
  } else {
    return sortOpts(opts)
  }
}
