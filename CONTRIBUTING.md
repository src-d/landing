# Contributing Guidelines

source{d} landing is copyrighted by source{d} and accepts
contributions via GitHub pull requests. This document outlines some of the
conventions on development workflow, commit message formatting, contact points,
and other resources to make it easier to get your contribution accepted.


## How to Contribute

Pull Requests (PRs) are the main and exclusive way to contribute to the project.
In order for a PR to be accepted it needs to pass the personal evaluation of at least one of the [maintainers](MAINTAINERS).


### Format of the commit message

Every commit message should describe what was changed and, if applicable, the GitHub issue it relates to:

```
Skip argument validations for unknown capabilities. Fixes #623
```

The format can be described more formally as follows:

```
<what changed>. [Fixes #<issue-number>]
```


# Development

## Requirements

You should already have [Go installed](https://golang.org/doc/install#install), and properly [configured the $GOPATH](https://github.com/golang/go/wiki/SettingGOPATH)
```shell
go version; # prints your go version
echo $GOPATH; # prints your $GOPATH path
```

The project must be under the `$GOPATH`, following the Go import conventions, what means you can go to its directory running:
```shell
cd $GOPATH/src/github.com/src-d/landing
```

You need also [Yarn installed](https://yarnpkg.com/en/docs/install)

```shell
yarn --version; # prints your Yarn version
```

## Install and build

You need to satisfy all [project requirements](#requirements), and then to run:

```shell
make build
```

## Development and running the landing locally

You need to satisfy all [project requirements](#requirements), and then to run:

```shell
LANDING_URL=//localhost PORT=8080 make serve
```
It runs everything you need to get the site working at [http://localhost:8080](http://localhost:8080)

Alternatively, you can start hugo, the api-server and webpack in a "three window mode", just running:
```shell
LANDING_URL=//localhost PORT=8080 yarn start
```
With this command, each window runs a command, that can be also ran by you in case you need to control the output of each command or in any other special case:
* `yarn run webpack-watcher` To start webpack watcher, that will rebuild the assets when you change its sources
* `make hugo-server` To serve the landing locally using hugo server
* `yarn run api-run` To start the landing API at [http://localhost:8080](http://localhost:8080)

### Preview the documentation site

It can be seen the landing _"as it would be a documentation site"_. To do so, it is needed to run:
```shell
make develop-documentation
```
And then, go to [http://localhost:8080](http://localhost:8080)

To rollback the changes, and see the landing as usual, just run:
```shell
make develop-documentation-destroy
```


## Configuration

The following envars are available for API configuration

- `ADDR`
- `FEED_BASE_URL`
- `POSITIONS_BASE_URL`
- `SLACK_CHANNEL`
- `SLACKIN_URL`

You can see more in the `config` package in `api`.
