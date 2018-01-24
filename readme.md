# Ωmen Cross

A hardware audio router (requires dedicated hardware).

## Tasks

### NPM Tasks

```
server          Run app locally
desktop         Run the app as a desktop application
dist-public     Prepare the public app for distribution
dist-server     Prepare the app server for distribution
dist            Prepare both public and server for dist
```

### Gulp Tasks

```
Available tasks
  build             Build the application from source
  bundle            Compile static bundles, takes optional -g argument
  clean             Remove all static build files
  dist              Prepare app for installation on the tessel
  server            Start simple server, reload source files on change
  unbundle          Removes static bundles, takes optional -g argument
```

## Database

Database files are saved to the local filesystem ```./database```

## Run App on a Tessel

```
npm run dist
t2 run dist/server/index.js
```

## Install App on a Tessel

```
npm run dist
t2 push dist/server/index.js
```
