# Onboarding wizard
The onboarding wizard is a generic library that can be used to dynamically generate an installation wizard. The wizard and all of its underlying components should be built with React in ES2015, using Babel to transpile the code to ES5. For consistency we will use browserify to manage JS modules

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisities
What things you need to install the software and how to install them
- node
- npm
- sass
- React
- Material UI

### Installing

A step by step series of examples that tell you have to get a development env running

#### 1. Loading the wizard onto your page.
Install the yoast-components into your project.
```
npm install Yoast/yoast-components
```
Add the following line into a scss file that you load on the page.
```
@import "../../node_modules/yoast-components/css/all.scss";
```
Render the wizard into a `div` element on your page.
```
import React from "react";
import ReactDOM from "react-dom";
import { OnboardingWizard } from "yoast-components";

class App extends React.Component {
	render() {
		return <OnboardingWizard { ...config }/>;
	}
}

ReactDOM.render( <App/>, document.getElementById( "wizard" ) );
```
#### 2. Specifying the config for the wizard.
The config is build up out of the following elements.

```
{
  endPoint: "http://the-endpoint-url",
  finishUrl: "http://redirect-on-finishing-and-closing-wizard",
  customComponents: {
    CustomComponent1,
    CustomComponent2,
  },
  fields{}
  steps{}
}
```
#### 3... The REST-API config

```
until finished
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* Dropwizard - Bla bla bla
* Maven - Maybe
* Atom - ergaerga
