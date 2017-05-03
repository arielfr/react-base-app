# react-base-app

This is a base React Application with Hot Module Replacement.

### Structure

### App

This folder contains the application, inside you will find:

- client: This is the entry point for webpack
- pages: This folder needs to have the next structure
    - page-name (This is the one that is going to be render automatically by the SSR)
        - index.js (Page that is going to be render with ReactDOM)
        - index.less (Main Styles for the page)

#### Routes

Inside this folder you need to add the routes

You have a helper called ReactRenderer

```
ReactRenderer.renderPage(req, res, 'index', {});
```

With this, you send the page name (subfolder on pages), and is going to automatically render with ReactDom the index.js inside

On production is webpack is going to generate the manifest.json and this is going to be read and use it to load the assets on the HTML

## Handlebars

The engine to load the vies is Handlebars. This is only needed to render the main page and put the Application and the assets on the HTML

## Scripts

If you want to develop, just:

```bash
node index.js
```

If you want to deploy the application to production, you need to build the application and the star the application

```bash
npm run-script build
npm start
```

## Author

Ariel Rey
