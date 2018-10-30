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


# Architecture

The landing contains 3 parts:

- The [static site](#static-site) itself: a webpack app,
- a [Go API](#api) to serve the latest blog posts, job offers and proxy to slackin,
- [Slackin](#slackin) to send invitations to our visitors to join our slack community.

In production, each part lives in a separated container.


## Static site

The static site is built with:
- **webpack**: `javascript` (with some `REACT` components) and `css` (from `SASS` stylesheets)
- **hugo**: for the `HTML` from `Go` templates and `YAML` data

Its source code is under:
- [`hugo` directory](hugo): for `hugo` sources:
  - `content` directory: contains one `.md` per landing page that defines each page metadata,
  - `data` directory: contains the landing variable content like titles, captions, descriptions, projects...
  - `layout` directory: contains the `HTML` templates.
- [`src` directory](src): for `js` and `sass` code,
- [`static/img` directory](static/img): for site images,


## API

The API serves (a cached version of):
- the 3 latest blog posts tagged as `technical`, and the 3 latest blog posts tagged as `culture` for the home page,
- all the opened positions at Lever,

Handles the visitor requests to join our slack community, sending an slack invitation through [Slackin](#slackin)

Its source code is under [`api` directory](api).


## Slackin

The slackin container listen for invitation requests made from the landing [api](#api).

For [technical reasons](https://github.com/src-d/landing/issues/62#issuecomment-327194704), slackin container is built from the release [v0.13.1](https://github.com/rauchg/slackin/tree/0.13.1)


# Development


## Requirements

You should already have [Go installed](https://golang.org/doc/install#install), and properly [configured the $GOPATH](https://github.com/golang/go/wiki/SettingGOPATH)
```shell
go version; # prints your go version
go env GOPATH; # prints your $GOPATH path
```

The project must be under the `$GOPATH`, following the Go import conventions, what means you can install and cd to its directory running:
```shell
go get github.com/src-d/landing/...
cd $GOPATH/src/github.com/src-d/landing
```

You also need [Yarn v1 installed](https://yarnpkg.com/en/docs/install)

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
LANDING_URL=//localhost PORT=8081 make serve
```
It runs everything you need to get the site working at [http://localhost:8081](http://localhost:8081)

Alternatively, you can start hugo, the api-server and webpack in a "three window mode", just running:
```shell
LANDING_URL=//localhost PORT=8081 yarn start
```
With this command, each window runs a command, that can be also ran by you in case you need to control the output of each command or in any other special case:
* `yarn run webpack-watcher` To start webpack watcher, that will rebuild the assets when you change its sources
* `make hugo-server` To serve the landing locally using hugo server
* `yarn run api-run` To start the landing API at [http://localhost:8080](http://localhost:8080)

### Preview the documentation site

Since the Landing repository is used as a blueprint for every documentation site as served by [src-d/docs](https://github.com/src-d/docs), the Landing can be used to generate a _"documentation like"_ site; To do so, it is needed to run:
```shell
make develop-documentation
```
And then, go to [http://localhost:8081](http://localhost:8081)

To rollback the changes, and see the landing as usual, just run:
```shell
make develop-documentation-destroy
```


## Configuration

The following envars are available for API configuration

envar | default *
- | -
`ADDR` | `:8080`
`FEED_BASE_URL` | `http://blog.sourced.tech/json/`
`POSITIONS_BASE_URL` | `https://api.lever.co/v0/postings/sourced?mode=json`
`SLACK_CHANNEL` |
`SLACKIN_URL` | `http://slackin:3000/invite`

&ast; The default values are defined by [api/config/config.go](https://github.com/src-d/landing/blob/master/api/config/config.go)
