# landing
[![Build Status](https://travis-ci.org/src-d/landing.svg?branch=master)](https://travis-ci.org/src-d/landing)

Serves API and landing page

Install and build
===
You should already have [hugo installed](https://gohugo.io/overview/installing/) in your machine;<br />
You need also [npm installed](https://docs.npmjs.com/getting-started/installing-node) ; then...
```
make build
```
If you want to build the project separatelly, you can replace the last command with these two:
* `yarn run build` To compile webpack stuff into `/static` folder
* `make hugo-build` To compile hugo stuff from `/content/layouts/static/data` folders into `/public` folder

Development:
===
```
make serve
```
This runs everything you need to get the site working at [http://localhost:8181](http://localhost:8181)

Alternatively, you can start hugo, the api-server and webpack in a "three window mode" running:
```
yarn start
```

If you want to build the project separatelly, you can replace the last command with these two:
* `yarn run api-run` To start the landing API at [http://localhost:8080](http://localhost:8080)
* `yarn run webpack-watcher` To start webpack watcher, that will rebuild the assets when you change its sources
* `make hugo-server` To serve the landing locally using hugo server

Configuration
===

The following envars are available for configuration

- `ADDR`
- `FEED_BASE_URL`
- `POSITIONS_BASE_URL`
- `SLACK_CHANNEL`
- `SLACKIN_URL`

You can see more in the `config` package in `api`.

Documentation site generation:
===
Described in [README.md](doc-site-generator/README.md)
