# landing [![Build Status](http://drone.srcd.host/api/badges/src-d/landing/status.svg)](http://drone.srcd.host/src-d/landing)

* Landing alpha: landing for alpha.sourced.tech

* Landing: serves API and landing page


Install
===
You should already have [hugo installed](https://gohugo.io/overview/installing/) in your machine;<br />
You need also [npm installed](https://docs.npmjs.com/getting-started/installing-node) ; then...
```
npm install -g webpack-dev-server #for development purposes
npm install -g webpack
npm install
```

Build it:
===
```
npm run build
```

Development server:
===
At this point, things are different if you are focused in Hugo, or in Webpack:
* `hugo server` will serve its stuff from /public folder, so everything should be there: js bundles too
* `webpack-dev-server`, will serve the bundles from memory, so no data is writen into /public 

Accessing the site through hugo:
---
Using `hugo server`, there will be live reload when hugo files changes;<br />
You should build the bundles using `webpack -w` (because using `webpack-dev-server` bundles are served from memory)
```
npm run hugo-server
npm run webpack-watcher
```
visit: [http://localhost:8181]()

Accessing the site through webpack:
---
using `webpack-dev-server` there will be live reload when webpack bundles changes;
```
npm run hugo-server
npm run webpack-server
```
visit: [http://localhost:8282]() or [http://localhost:8282/webpack-dev-server/]()
