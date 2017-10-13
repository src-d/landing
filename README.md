# Landing
[![Build Status](https://drone.srcd.host/api/badges/src-d/landing/status.svg)](https://drone.srcd.host/src-d/landing)

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
LANDING_URL=//localhost PORT=8080 make serve
```
It runs everything you need to get the site working at [http://localhost:8080](http://localhost:8080)

Alternatively, you can start hugo, the api-server and webpack in a "three window mode", just running:
```
LANDING_URL=//localhost PORT=8080 yarn start
```
With this command, each window runs a command, that can be also ran by you in case you need to control the output of each command or in any other special case:
* `yarn run webpack-watcher` To start webpack watcher, that will rebuild the assets when you change its sources
* `make hugo-server` To serve the landing locally using hugo server
* `yarn run api-run` To start the landing API at [http://localhost:8080](http://localhost:8080)

## Preview the documentation site

It can be seen the landing "as it would be a documentation site". To do so, it is needed to run:
```
make develop-documentation
```
And then, go to [http://localhost:8080](http://localhost:8080)

To rollback the changes, and see the landing as usual, just run:
```
make develop-documentation-destroy
```


Configuration
===

The following envars are available for configuration

- `ADDR`
- `FEED_BASE_URL`
- `POSITIONS_BASE_URL`
- `SLACK_CHANNEL`
- `SLACKIN_URL`

You can see more in the `config` package in `api`.
