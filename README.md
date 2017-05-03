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

## License
```
The MIT License (MIT)

Copyright (c) <2017> <Ariel Rey>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
