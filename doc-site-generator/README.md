# Docummentation site generator

It can be generated &ndash;and served&ndash; a _landing-like site_, containing the documentation for a project, running:

```
# Env vars that would be defined by docsrv if it would be ran through that service
export OUTPUT=<output_path>;
export SOURCES=<sources_path>;
export BASE_URL=<hostname>:<port>;
export HOST_NAME=<hostname>;
export VERSION=<version>;

# The following will generate the site into the $OUTPUT dir, and will serve from there under http://<hostname>:<port>
make generate-documentation-site;
```

where:
- **output_path**: absolute path where the new documentation site will be generated
- **sources_path**: absolute path to the project which documentation will be generated
- **port**: port under the docs will be served
- **hostname**: hostname under the docs will be served. It must match the `project.hostname` as defined in [data/categories.yml](../hugo/data/categories.yml)
- **version**: version of the project as being in `sources_path`

## example:

To serve the go-git documentation you need to have:
- the go-git repo downloaded under `$GOSRC/gopkg.in/src-d/go-git.v4`,
- an entry in the `/etc/hosts` like the following:<br />
```127.0.0.1    go-git.sourced.tech```

```
export OUTPUT=/tmp/dcsrv/test;
export SOURCES=$GOSRC/gopkg.in/src-d/go-git.v4;
export BASE_URL=go-git.sourced.tech:8181;
export HOST_NAME=go-git.sourced.tech;
export VERSION=v4;

make generate-documentation-site;
```

# For development purposes...
Since developing in a _generated site_ can be a pain (because it is "generated code"), there is a way to view the documentation site **over the original landing itself**.

If you proceed that way, it will be created, **into the original landing repo**, some mockup stuff to display a _"documentation-like site"_, and you will be able to the edit code, see changes and commit them, directly from the landing repo.

To do so, just run (before setting the proper env vars):
```
make develop-documentation
```

To delete the generated stuff &ndash;and view the original landing site again&ndash;, just run:
```
make develop-documentation-destroy
```
