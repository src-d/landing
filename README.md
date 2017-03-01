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

Deployment:
==========

### Staging

[Staging landing](http://104.155.102.255:8090/)

1. In [rancher.srcd.host](rancher.srcd.host), click on application landing and then on
   landing-validation service.
2. Push a new tag with the new RC (make sure it follows the versioning number)
   and wait for [drone.srcd.host](drone.srcd.host) to finish the build.
3. In landing-validation, look for a menu option for upgrading. Then, add the
   new image from quay.io (it is in the drone log or you must just change the
   tag version, first option is safer). Really make sure the URL contains the
   new tag in it.
4. Select upgrade. Leave the old container for a back in case we need to
   rollback.
5. Be happy, you have deployed it :)

### Production

[Production landing](http://sourced.tech/)

1. Take instructions for staging and `s/landing-validation/landing/`.
2. Leave the old version for a while longer than in staging.
3. Be happier, your changes are out there.

### Super-little-suggestions of the day

* Visit the landing (home and careers right away) to assure people is hitting
  a cached version and don't need to wait.
