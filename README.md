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
```
make landing-local-serve
```
This runs everything you need to get the site working at [http://localhost:8181](http://localhost:8181)

If you want to build the project separatelly, you can replace the last command with these two:
* `npm run api-run` To start the landing API at [http://localhost:8080](http://localhost:8080)
* `npm run webpack-watcher` To start webpack watcher, that will rebuild the assets when you change its sources
* `npm run hugo-server` To serve the landing locally using hugo server

Deployment:
==========

## Production

[Production landing](http://sourced.tech/)

1. Push a new tag with the new code (make sure it follows the versioning number) and wait for [drone.srcd.host](http://drone.srcd.host) to finish the build and provide the new image url (that will have the format: `quay.io/srcd/landing:${TAG_NAME}`).
2. From [cloud.google.com/live-srcd-host](https://console.cloud.google.com/compute/instancesDetail/zones/europe-west1-d/instances/live-srcd-host), click on SSH button to open a connection into the machine.
3. From the shell, you will have to pull the new docker image, drop the old (and already stopped) landing container, rename the current/running landing container, stop it, run a new one with the just downloaded image using the same name used by the past landing container.

   The process is something like the following:

Pull the just created docker image
```
sudo su #docker commands must be ran as root
TAG_NAME='v1.3.4' # set the tag name to the just created docker image
docker pull quay.io/srcd/landing:${TAG_NAME}
```

At this point, you should see the just downloaded image doing:
```
docker images
```

In order to guess wich containers will be affected, and which ones are running or stopped, run the following command
```
docker ps -a
```

Now it will be removed the old container (already stopped since the last deploy). Once you remove it, there will be no quick rollback to that OLD version.
Once you remove the "old" one, rename the currently running container to a new "-old" name (for further rollbacks)
```
docker rm landing-PROD-old
docker rename landing-PROD landing-PROD-old 
```

Stop the current container -> Landing is DOWN -> run the new container -> Landing is UP
```
docker stop landing-PROD-old
docker run -d -p 80:8090 -p 8080:8080 --name landing-PROD quay.io/srcd/landing:${TAG_NAME}
```

If you run `docker ps` you will see that the running container has a new image, matching the just downloaded image.

Cross your fingers, and press F5 :)

### Super-little-suggestions of the day

* Visit the landing (home and careers right away) **after deploying** to assure people is hitting a cached version and don't need to wait.

## Staging

[Staging landing](http://104.155.102.255:8090/)

1. Take instructions for production, and adapt them for this environment and host port `8090`.

```
sudo su
TAG_NAME='v1.3.4-rc1'
docker pull quay.io/srcd/landing:${TAG_NAME}
docker stop landing-STAGING
docker rm landing-STAGING
docker run -d -p 8090:8090 --name landing-STAGING quay.io/srcd/landing:${TAG_NAME}
```

Be aware of not affecting the production container ;)

Troubleshooting:
==========

Something goes wrong

### The machine ran out of space.
1. Confirm it with `df`
2. If so, delete **very old** images with `docker rmi ${IMAGE_ID}`
3. Check if there are dangling images with this `docker images -af "dangling=true"`
4. Delete dangling images if necessary `docker rmi $(docker images -qf "dangling=true")`
5. If space is not enough, call the police :(

### Whatever problem.
1. Confirm that it is not a free space problem before the next step
2. Try a new deploy of the container (it is not neede to download the same image again). Just drop the current container, and run a new one following the Deploy guidelines.
3. If the problem persists, call the police :(
