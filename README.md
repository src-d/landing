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

Development:
===
There are four `npm run` commands available:
* **Watchers**, that will generate stuff (and listen for changes in sources), and put it into /public
    * `npm run hugo-watcher` will handle hugo static files
    * `npm run webpack-watcher` will put webpack stuff (css/js)
* **Servers**, that will serve the site (and listen for changes, reloading the page as well)
    * `npm run hugo-watcher` will serve the /public folder (and will keep /public updated when source changes)
    * `npm run webpack-server`, will serve the site from memory, so no data is writen into /public 

Accessing the development servers:
---
There are many ways to accessing the site using the developent servers.
The ways to do it depends if you are focused in listening for hugo stuff changes, or webpack (css/js) changes.


### using hugo:
`hugo server`, will serve /public content and reload the page when hugo files changes;<br />
When hugo server is started, hugo deletes /public folder and create it again, so other stuff should be generated again later
```
npm run hugo-server
npm run webpack-watcher
```
visit: [http://localhost:8181](http://localhost:8181)

### using webpack:
There are two alternatives using webpack server:

If you doesn't need listen for hugo changes, you can execute:
```
npm run build; npm run webpack-server
```
If you want to listen for hugo, css and js changes, you should do:
```
npm run hugo-watcher
npm run webpack-server
```
visit: [http://localhost:8282](http://localhost:8282); live reload in [http://localhost:8282/webpack-dev-server/](http://localhost:8282/webpack-dev-server/)
