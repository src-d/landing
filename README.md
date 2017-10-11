# Landing
[![Build Status](https://travis-ci.org/src-d/landing.svg?branch=master)](https://travis-ci.org/src-d/landing)

Serves the source{d} Landing and its API

Requirements
===
You should already have [Go installed](https://golang.org/doc/install#install), and properly [configured the $GOPATH](https://github.com/golang/go/wiki/SettingGOPATH)
```
go version; # prints your go version
echo $GOPATH; # prints your $GOPATH path
```

The project must be under the `$GOPATH`, following the Go import conventions, what means you can go to its directory running:
```
cd $GOPATH/src/github.com/src-d/landing
```

You need also [Yarn installed](https://yarnpkg.com/en/docs/install)

```
yarn --version; # prints your Yarn version
```

Install and build
===

You need to satisfy all [project requirements](#requirements), and then to run:

```
make build
```

Development and running the landing locally
===

You need to satisfy all [project requirements](#requirements), and then to run:

```
LANDING_URL=//localhost PORT=8181 make serve
```
It runs everything you need to get the site working at [http://localhost:8181](http://localhost:8181)

Alternatively, you can start hugo, the api-server and webpack in a "three window mode", just running:
```
LANDING_URL=//localhost PORT=8181 yarn start
```
With this command, each window runs a command, that can be also ran by you in case you need to control the output of each command or in any other special case:
* `yarn run webpack-watcher` To start webpack watcher, that will rebuild the assets when you change its sources
* `make hugo-server` To serve the landing locally using hugo server
* `yarn run api-run` To start the landing API at [http://localhost:8181](http://localhost:8181)

Configuration
===

The following envars are available for configuration

- `ADDR`
- `FEED_BASE_URL`
- `POSITIONS_BASE_URL`
- `SLACK_CHANNEL`
- `SLACKIN_URL`

You can see more in the `config` package in `api`.
