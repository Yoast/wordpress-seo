# Onboarding wizard
The onboarding wizard is a generic library that can be used to dynamically generate an installation wizard. The wizard and all of its underlying components should be built with React in ES2015, using Babel to transpile the code to ES5. For consistency we will use browserify to manage JS modules

## Installing
A step by step series of examples that tell you have to get a development env running

### Prerequisities
What things you need to install the software and how to install them
- node
- npm
- sass
- React
- Material UI

### React tap event plugin
Some components use [react-tap-event-plugin](https://github.com/zilverline/react-tap-event-plugin) to listen for touch events because onClick is not fast enough This dependency is temporary and will eventually go away. Until then, be sure to inject this plugin at the start of your app.

```
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
```


### Loading the wizard onto your page.
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
// Required to make the wizard work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

class App extends React.Component {
	render() {
		return <OnboardingWizard { ...config }/>;
	}
}

ReactDOM.render( <App/>, document.getElementById( "wizard" ) );
```
## Configure the wizard

### General config
The config is build up out of the following elements.

  - Required:
    - `endPoint`, _string_, endpoint for the REST-API endpoint for the wizard to send the results for the steps to.
    - `finishUrl`, _string_, finish URL for the wizard to redirect the user to after completing/closing the wizard. 
    - `fields`, _array_, fields to be included in the steps.
    - `steps`, _array_, steps referencing which fields belong to them.
    - `endpoint`, _string_, used to save the data which is submitted by the user.
  - Optional:
    - `customComponents`, _array_, used for rendering custom components.

### Custom components

### Translations

## Set-up an REST-API endpoint

```
until finished
```

