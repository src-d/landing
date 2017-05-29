# landing [![Build Status](http://drone.srcd.host/api/badges/src-d/landing/status.svg)](http://drone.srcd.host/src-d/landing)

Serves API and landing page

Install and build
===
You should already have [hugo installed](https://gohugo.io/overview/installing/) in your machine;<br />
You need also [npm installed](https://docs.npmjs.com/getting-started/installing-node) ; then...
```
make hugo-build
```
If you want to build the project separatelly, you can replace the last command with these two:
* `npm run build` To compile webpack stuff into `/static` folder
* `make hugo-build` To compile hugo stuff from `/content/layouts/static/data` folders into `/public` folder

Development:
===
```
make landing-local-serve
```
This runs everything you need to get the site working at [http://localhost:8181](http://localhost:8181)

If you want to build the project separatelly, you can replace the last command with these two:
* `npm run api-run` To start the landing API at [http://localhost:8080](http://localhost:8080)
* `npm run webpack-watcher` To start webpack watcher, that will rebuild the assets when you change its sources
* `make hugo-server` To serve the landing locally using hugo server