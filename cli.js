#!/usr/bin/env node
'use strict'

const meow = require('meow')
const watchGHRepos = require('./src/index.js')
const Promise = require('bluebird')
const _ = require('lodash')
const gitconfig = require('gitconfiglocal')
const pify = require('pify')

const cli = meow([`
  Usage
    $ watch-gh-repos <input> [opts]

  Options
    -i, --ignore Ignore notifications from a repository
    -o, --org Specify all repositories from an organization or user
    -r, --repo Specify a repo
    -t, --token A token
    -u, --unwatch Unwatch instead of watch

  Examples
    ~/src/RichardLitt/unwatch-gh-repos $ watch-gh-repos
    Now watching: RichardLitt/unwatch-gh-repos

    $ watch-gh-repos RichardLitt/watch-gh-repos
    Now watching: RichardLitt/watch-gh-repos

    $ watch-gh-repos RichardLitt/watch-gh-repos --unwatch
    Unwatched: RichardLitt/watch-gh-repos

    $ watch-gh-repos --org RichardLitt
    Watching all RichardLitt repos.
    ...
`], {
  string: ['ignore', 'org', 'repo', 'token', 'unwatch'],
  alias: {
    i: 'ignore',
    o: 'org',
    r: 'repo',
    t: 'token',
    u: 'unwatch'
  }
})

if (cli.input.length === 0 && _.isEmpty(cli.flags)) {
  pify(gitconfig)(process.cwd())
  .then(config => {
    if (config && config.remote && config.remote.origin && config.remote.origin.url) {
      var url = config.remote.origin.url
      return url.match(/([^/:]+\/[^/.]+)(\.git)?$/)[1]
    }
  }).then((res) => {
    cli.flags['repo'] = res
    getResponse(cli.flags)
  }).catch((err) => {
    console.log('You must run this in a git repo, or provide an argument.')
  })
} else if (cli.input.length !== 0 && _.isEmpty(cli.flags)) {
  cli.flags['repo'] = cli.input[0]
  getResponse(cli.flags)
}

function getResponse (opts) {
  watchGHRepos(opts).then((data) => {
    console.log(data)
  })
  // .each(function (response) {
  //   switch (response.status) {
  //     case 'unwatched':
  //       console.log(`Unwatched: ${response.repo}`)
  //       break
  //     case 'watched':
  //       console.log(`Now watching: ${response.repo}`)
  //       break
  //     default:
  //       console.log('Error: ', response)
  //   }
  // })
}
