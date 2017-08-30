# React Boilerplate for SSR + HMR (React + LESS files)

This is a boilerplate for a Server Side React Application with Client side code too, with Hot Module Replacement. HMR applies to React Components and **LESS** files. This application is a boilerplate, so you can use it to create your own React Application.

Just clone it, fork it, or copy the code and start constructing yout application. This is just a skeleton.

**This application is Production Ready. You just need to compile the assets and run the app, and it will work like a charm**.

### Structure

### App

This folder contains the application, inside you will find:

- client: This is the entry point for webpack
- pages: This folder needs to have the next structure
    - page-name (This is the one that is going to be render automatically by the SSR)
        - index.js (Page that is going to be render with ReactDOM)
        - index.less (Main Styles for the page)

#### Routes

The res.render method has been re-write. It works like a view-engine for React. You only need to pass the name of the page that you want to render and the initial props to send:

```javascript
res.render('index', {});
```

Then the render method is going to find the Page Component that inside the index folder on pages

#### Layout

The application will load a Default Layout for the page. You can send more props to the Default Layout adding them to the props sended on res:

```javascript
res.render('index', {
  layout: {
    key: 'This is a prop that is only going to be use by the layout'
  }
});
```

## Configurations

The application includes the library [config](http://npmjs.com/package/config) to load the configurations. Just include the package and use it.

````javascript
const config = require('config');

config.get('specific.configuration');
````

## Logger

This boilerplate includes a logger helper witch use **winston** to ouput on the console. To use it just:

````javascript
const logger = require('directory/helpers/logger')('log-name');

logger.info('This is a log');
````

This are the available methods:
- info
- warn
- error
- verbose
- debug
- silly

## Scripts

If you want to develop, just:

```bash
npm run start-dev
```

## Scripts + Production

If you want to deploy the application to production, you need to build the application and the star the application

```bash
npm run-script build
npm start
```

## Author

Ariel Rey
