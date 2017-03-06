# watch-gh-repos

> Watch or unwatch GitHub repositories

## Install

```sh
> npm i watch-gh-repos
```

## Usage

You will need a token. You can pass this token in through the command line using the `--token` flag, or by setting it in your env as `WATCH_GH_REPOS`.

```sh
$ watch-gh-repos RichardLitt/watch-gh-repos
Now watching: RichardLitt/watch-gh-repos

$ watch-gh-repos RichardLitt/watch-gh-repos --unwatch
Unwatched: RichardLitt/watch-gh-repos

$ watch-gh-repos RichardLitt
Watching all RichardLitt repos.
Now watching: RichardLitt/{first-repo}
Now watching: RichardLitt/{second-repo}

$ watch-gh-repos RichardLitt --unwatch
Unwatching all RichardLitt repos.
Unwatched: RichardLitt/{first-repo}
Unwatched: RichardLitt/{second-repo}
```

## Contribute

Contributions welcome. Please check out [the issues](https://github.com/RichardLitt/watch-gh-repos/issues).

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](LICENSE) © 2017 Richard Littauer
