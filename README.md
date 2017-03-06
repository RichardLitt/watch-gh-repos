# watch-gh-repos

> Watch, unwatch, or ignore GitHub repositories

## Install

```sh
> npm i watch-gh-repos
```

## Usage

```js
const watchGhRepos = require('watch-gh-repos')

watchGHRepos({'watch': 'RichardLitt/watch-gh-repos', 'token': someToken})
 .then((res) => {
   console.log(res) // Watch all the things!
 })
```

### Options

- `-g,` `--get` Get repo watching details
- `-i,` `--ignore` Ignore notifications from a repository
- `-o,` `--org` Specify all repositories from an organization or user
- `-r,` `--ratelimit` Skip checks making sure GitHub repo is valid (Skips 1 hit per repo)
- `-t,` `--token` A Personal Access Token for GitHub. You need scopes `notifications` and `repos`.
- `-u,` `--unwatch` Unwatch instead of watch
- `-w,` `--watch` Specify a repo

### CLI

You will need a token. You can pass this token in through the command line using the `--token` flag, or by setting it in your env as `WATCH_GH_REPOS`. This token needs the scopes `notifications` and `repos` to be enabled.

#### Install

```sh
npm i -g watch-gh-repos
```

#### Usage 
```sh

Usage
  $ watch-gh-repos <input> [opts]

Options
  -g, --get Get repo watching details
  -i, --ignore Ignore notifications from a repository
  -o, --org Specify all repositories from an organization or user
  -r, --ratelimit Skip checks making sure GitHub repo is valid (Skips 1 hit per repo)
  -t, --token A token
  -u, --unwatch Unwatch instead of watch
  -w, --watch Specify a repo

Examples
  ~/src/RichardLitt/unwatch-gh-repos $ watch-gh-repos
  Watched: RichardLitt/unwatch-gh-repos

  $ watch-gh-repos RichardLitt/watch-gh-repos
  Watched: RichardLitt/watch-gh-repos

  $ watch-gh-repos --unwatch RichardLitt/watch-gh-repos
  Unwatched: RichardLitt/watch-gh-repos

  $ watch-gh-repos --org --watch RichardLitt
  Watched: RichardLitt/first-repo
```

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/RichardLitt/watch-gh-repos/issues).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](LICENSE) © 2017 Richard Littauer
