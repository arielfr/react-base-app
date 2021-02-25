# React Boilerplate for SSR + HMR (React + SASS files) + Isomorphic Code + Adaptive Design (YES!)

> Side Note: I'm proud to announce that it's working with React16 with hydrate.

This is a boilerplate for creating a Server Side React Application with Client Side. This works using Isomorphic code between server and client side. HMR applies to React Components and **SASS** files. This application is a boilerplate, so you can use it to create your own React Application.

**It counts with Adaptive Design, you only need to enable the `adaptive` configuration on the config files** (This is explain at more detail below).

Just clone it, fork it, or copy the code and start constructing yout application. This is just a skeleton.

**This application is Production Ready. You just need to compile the assets and run the app, and it will work like a charm**.

### App Structure

This folder contains the application, inside you will find:

- client: This is the entry point for webpack
- pages: This folder needs to have the next structure
    - page-name (This is the one that is going to be render automatically by the SSR)
        - styles (This is the styles folder)
            - index.scss (Main Styles for the page) - Non Adaptive
        - index.js (Page that is going to be render with ReactDOM)
        
If you want to use adaptive mode, you need to create two different styles files inside `styles` folder

- index.desktop.scss
- index.mobile.scss

Depending on the device that enters the page, it will server `desktop` or `mobile` css automatically.

#### Adaptive

To use Adaptive design on the application, you need to enable the **adaptive** configuration on the config files:

```json
"adaptive": true
```

Then you need to use the patter for adaptive design. That means you need two CSS files, one for `desktop` and one for `mobile`. The application is going to automatically loads the asset file depending on the device use to render.

If you want to change the component that is going to be render depending the device, a **device** prop is going to be *injected* in all the pages. So, in your application index, you are going to count with the device property and you can render the components depending on them:

```javascript
const React = require('react');
const { Component } = require('react');

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('cargo...');
  }

  render() {
    return (React.Children.only(this.props.device.type === 'desktop' ? <DesktopPageComponent/> : <MobilePageComponent/>));
  }
}

module.exports = App;
```

#### Built-in Examples

You will count with two examples:

- index: Example page without adaptive design
If you want to try the index example you need to disable the **adaptive configuration**.

Endpoint to test: /

- adaptive: Example page with adaptive design
If you want to try the index example you need to enable the **adaptive configuration**.

Endpoint to test: /adaptive

#### Routes

The res.render method has been **re-write**. It works like a view-engine for React. You only need to pass the name of the page that you want to render and the initial props to send:

```javascript
res.render('index', {});
```

Then the render method is going to find the Page Component that inside the index folder on pages

#### Layout

The application will load a Default Layout for the page. You can send more props to the Default Layout adding them to the props sent on res:

```javascript
res.render('index', {
  layout: {
    key: 'This is a prop that is only going to be use by the layout'
  }
});
```

##### Layout Default Props

The default props receive by the layouts are:

- userAgent (From Header)
- device (From device detection middleware)


### Page Component Default Props

The `index.js` component for the page is also going to receive default props:

- device (From device detection middleware)

## Configurations

The application includes the library [config](http://npmjs.com/package/config) to load the configurations. Just include the package and use it.

````javascript
const config = require('config');

config.get('specific.configuration');
````

## Logger

This boilerplate includes a logger helper witch use [**winston**](https://www.npmjs.com/package/winston-this) to ouput on the console. To use it just:

````javascript
const logger = require('winston-this')('log-name');

logger.info('This is a log');
````

This are the available methods:
- info
- warn
- error
- verbose
- debug
- silly

## Device Detection

Inside the project you will find a `device-detection` middleware. This will use the `user-agent` and match with a REGEX to find out wich device it is.

Its using the [device](npmjs.com/package/device) package to do this. Then, we manipulate the response to send only the next types:

- desktop
- mobile

You can find the object device on the request:

```javascript
req.device = {
  type: 'desktop',
  model: ''
}
```

If you want to get the specific model of the device, you need to change the configuration `get-model` to `true` on `device-detection`.

## Unit Testing

This application is testing ready. It already includes the next dependencies:

- enzyme
- enzyme-adapter-react-16 (Adapter for React16)

It also includes the setup.js (inside test folder) for executing tests of Enzyme for React16.

### What do I need to do?

You only need to create the tests file on the test folder or in the specific component folder. The file name must end with `*.spec.js`. Example:

```
index.spec.js
```

## Covertura

If you have tests, you can have Covertura. We include the next packages for calculating the covertura:

- istanbul

You can configure it using the `.istanbul.yml` file

## Run Tests & Covertura

To run the Unit Tests you just need to run the next command:

```bash
npm run test
```

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
