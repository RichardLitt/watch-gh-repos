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
  string: ['org', 'repo', 'token', 'unwatch'],
  alias: {
    o: 'org',
    r: 'repo',
    t: 'token',
    u: 'unwatch'
  }
})

Promise.try(() => {
  if (cli.input.length === 0 && _.isEmpty(cli.flags)) {
    return Promise.try(() => {
      return pify(gitconfig)(process.cwd())
    }).then((config) => {
      if (config && config.remote && config.remote.origin && config.remote.origin.url) {
        // TODO Fix this super brittle thing you've got going on here.
        cli.flags['repo'] = config.remote.origin.url.split(':')[1].split('.git')[0].split('/')
      }
    }).catch((err) => {
      console.log('You must run this in a git repo, or provide an argument.')
      process.exit(1)
    })
  // Allow people to have one repo without the flag
  } else if (cli.input.length !== 0 && _.isEmpty(cli.flags)) {
    cli.flags['repo'] = cli.input[0]
  }
}).then(() => watchGHRepos(cli.flags))
.then((data) => {
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
