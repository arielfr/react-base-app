# react-base-app

This is a base React Application with Hot Module Replacement.

**Production Ready**

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

## Handlebars

The engine to load the vies is Handlebars. This is only needed to render the main page and put the Application and the assets on the HTML

## Scripts

If you want to develop, just:

```bash
node index.js
```

## Scripts + Production

If you want to deploy the application to production, you need to build the application and the star the application

```bash
npm run-script build
npm start
```

## Author

Ariel Rey
