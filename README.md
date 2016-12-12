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
* `npm run hugo-build` To compile hugo stuff from `/content/layouts/static/data` folders into `/public` folder

Development:
===
There is two watchers available to generate all the stuff (that should be run separately):
* `npm run webpack-watcher`, compiles webpack stuff (css/js) into `/static` folder
* `npm run hugo-server`, serves the `/public` folder after compiling it (as `npm run hugo-build` does)

visit: [http://localhost:8181](http://localhost:8181)

API:
===
To start the landing API, run:
* `npm run api-run`

visit: [http://localhost:8181](http://localhost:8080)