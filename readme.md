# JS All The Things

* Serve static content via [FeathersJS](http://docs.feathersjs.com/)
* Database of static JSON files via [NeDB](https://github.com/louischatriot/nedb)
* Frontend package management via [JSPM](http://jspm.io/)
* Frontend module loading via [SystemJS](https://github.com/systemjs/systemjs)
* Realtime event system via [SocketIO](http://socket.io/)
* Task runner, Sass compiler via [Gulp](http://gulpjs.com/)
* Desktop application wrapper via [Electron](http://electron.atom.io/)

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
$> electron .
```

## Database

Database files are saved to the local filesystem ```./database/items.db```

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
