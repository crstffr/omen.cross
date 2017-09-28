# Ωmen Cross

A hardware audio router (requires dedicated hardware).

## Installation

```
git clone https://github.com/crstffr/js-all-the-things.git

npm install -g gulp jspm electron nodemon

npm install
```

## Run Server

```
npm run server
```

## Run Angular App

This will live reload as changes are made to public files.

```
npm run public
```

## Run Desktop App

This will execute the server and launch an Electron desktop app.

An icon will appear in your OS tray, with a couple menu options.

```
npm run desktop
```

## Database

Database files are saved to the local filesystem ```./database```

## Gulp Tasks

```
Available tasks
  build             Build the application from source
  bundle            Compile static bundles, takes optional -g argument
  clean             Remove all static build files
  dist              Prepare app for distribution
  server            Start simple server, reload source files on change
  unbundle          Removes static bundles, takes optional -g argument
```
