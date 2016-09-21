# Onboarding wizard
The onboarding wizard is a generic library that can be used to dynamically generate an installation wizard. The wizard and all of its underlying components are built with React in ES2015.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installing](#installing)
	- [Prerequisities](#prerequisities)
		- [React tap event plugin](#react-tap-event-plugin)
	- [Loading the wizard onto your page.](#loading-the-wizard-onto-your-page)
- [Configuring the wizard](#configuring-the-wizard)
	- [General configuration](#general-configuration)
	- [Fields](#fields)
		- [Specification](#specification)
		- [Available components](#available-components)
		- [Custom components](#custom-components)
		- [Fields definition example](#fields-definition-example)
	- [Steps](#steps)
		- [Specification](#specification)
		- [Steps definition example](#steps-definition-example)
	- [Translations](#translations)
	- [Accesibility](#accesibility)
- [Persisting the data](#persisting-the-data)
	- [Setting the initial field data](#setting-the-initial-field-data)
	- [Persisting the options](#persisting-the-options)

<!-- /TOC -->

## Installing

### Prerequisities
The wizard depends on a few other modules/libraries. Before you start the following software has to be installed on your system:
- Node
- NPM
- Sass

#### React tap event plugin
Some components use [react-tap-event-plugin](https://github.com/zilverline/react-tap-event-plugin) to listen for touch events because onClick is not fast enough. This dependency is temporary and will eventually go away. Until then, be sure to inject this plugin at the start of your app.

```JS
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
```

### Loading the wizard onto your page.
This chapter explains how you can render the wizard onto a webpage.

The following modules have to be installed and added to your package.json:
- `react`
- `material-ui`
- `react-tap-event-plugin`
- `Yoast/yoast-components`

Add the following line into a scss file that you load on the page.

```CSS
@import "../../node_modules/yoast-components/css/all.scss";
```

Render the wizard into a `div` element on your page.

```JS
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

## Configuring the wizard

A wizard has a variable amount of steps. Each step can contain a set of predefined fields, through which the user can configure settings. A user can traverse through these steps by using the available navigation controls (a stepper and buttons). Whenever a user switches steps, the fields in the current step are saved to the server.

### General configuration

The following config attributes can / should be specified:

- Required attributes:
  - `fields`, _object_, The field definitions.
  - `steps`, _object_, The step definitions.
  - `endpoint`, _string_, The endpoint URL used to save the data submitted by the user.
  - `finishUrl`, _string_, The finish URL for the wizard to redirect the user to after completing/closing the wizard. 
- Optional attributes:
  - `customComponents`, _object_, Here you can inject custom components (fields) to be used within steps.

### Fields

#### Specification

Fields have the following attributes:

- `name`, _string_, the name of the field.
  - `component`, _string_, references the component that should be used to render the field in the component tree.
  - `properties`, _object_, contains properties that will be passed to the component when it's rendered. This is specific for the component that is used.
  - `requires`, _object_, (optional) can be used to make sure a field is only rendered when another field has a certain value.
  	- `field`, _string_, the field name for the other field.
  	- `value`, _string_, the value this field has to have.
  - `data`, _mixed_, the value of the field. This can be used to set the initial state of the field.

#### Available components

Currently we've implemented three different field components from which you can choose:

- `Choice`
  Renders a choice interface, like a group of radio buttons or a select button. Currently only radio buttons have been implemented.
  - `Properties`:
    - `label`: The label for the input element to be rendered.
    - `explanation`, _string_, (optional) An extra explanation that is shown underneath the choice field.
    - `choices`: a JSON string with choices where the key represents the `value` and the value is an object with `choice` properties:
      - `label`, _string_, The label of the choice.
      - `screenReaderText`, _string_, (optional) can be used to provide a little extra context per choice for people using screenreaders.
- `Input`
  Renders a textarea.
  - `properties`:
    - `label`: The label for the input element to be rendered.
    - `placeholder`: placeholder text.
    - `pattern`: a regular expression that can be used to validate the string format. (not MVP)
    - `explanation`, _string_, (optional) An extra explanation that is shown underneath the input field.
- `HTML`
  Takes a piece of HTML and renders it. This can be used to render some paragraph of text in the steps. Purely meant for adding copy to the wizard in a generic way, not functionality.
  - `properties`:
    - `html`: The html to be rendered.

#### Custom components
It is possible to inject custom component fields into the `Wizard`. The custom components have to be React elements that can be rendered by the wizard. They should be implemented beforehand and they can be required and injected when instantiating the Wizard. Below is an example of how to add your custom components to the wizard's config.

```JS
import CustomComponent1 from "/example/path/CustomComponent1";
import CustomComponent2 from "/example/path/CustomComponent2";
  
let config = {
  fields: {},
  steps: {},
  endpoint: "",
  finishUrl: "",
  customComponents: {
    CustomComponent1,
    CustomComponent2
  }
};

class App extends React.Component {
	render() {
		return <OnboardingWizard { ...config }/>;
	}
};
```

#### Fields definition example

```JSON
"fields": {
  "introduction": {
    "component": "HTML",
    "properties": {
      "html": "<p>Welcome to the onboarding wizard!</p>"
    }
  },
  "favoriteColor": {
    "component": "Choice",
    "properties": {
      "label": "What is your favorite color?",
      "choices": {
        "green": {
          "label": "Green"
        },
        "purple": {
          "label": "Purple"
        },
      },
    },
    "data": "",
    "default": "purple"
  },
  "lastName": {
    "component": "Input",
    "properties": {
      "label": "What is your last name?",
    },
    "data": "{last_name}"
  },
  "shadesOfGreen": {
    "componentName": "Choice",
    "properties": {
      "label": "What is your favorite color?",
      "choices": {
        "darkGreen": {
          "label": "Dark green"
        },
        "lightGreen": {
          "label": "Light green"
        },
      },
    },
    "requires": {
      "field": "favoriteColor",
      "value": "green",
    },
    "data": "",
    "default": "darkGreen"
	}
}
```

### Steps

#### Specification

A Step has the following attributes:

- `id`, _string_, identifier
  - `title`, _string_, the title of the step.
  - `fields`, _array_, list of strings referencing fields by key. 

As an example let's use the fields specified above. In the config you could define the steps like this:

#### Steps definition example

```JSON
"steps": {
  "credentials": {
    "title": "Credentials",
    "fields" : ["lastName"]
  },
  "personalPreferences": {
    "title": "Personal preferences",
    "fields" : ["favoriteColor", "shadesOfGreen"]
  }
}
```

### Translations
The text for the different elements in the wizard can be tanslated. The wizard uses the same priciple as [i18n calipso - localize](https://github.com/Automattic/i18n-calypso#localize) uses. 

The translations have to be added to the config that the wizard uses:

```JS
import { setTranslations } from "yoast-components/utils/i18n";
import isUndefined from "lodash/isUndefined";

if ( ! isUndefined( yoastWizardConfig.translations ) ) {
	setTranslations( yoastWizardConfig.translations );
}
```

### Accesibility
The wizard is setup with accesibility in mind. The wizard can be used with a keyboard and a screenreader. All input fields in the forms have labels that are linked to them. Choice elements also have an extra screen reader text that you can add. This adds an aria-label to the options, the screenreader will read this label instead of the label that is visible on the page. This way you can add a better description for people who use a screenreader.

## Persisting the data
The wizard uses a API requests to send it's data to the endpoint that is set via the config that is provided to the wizard. The wizard uses [jQuery](http://api.jquery.com/jquery.ajax/) for sending it's requests, but if it is not available a module called [fetch](https://github.com/github/fetch) is used.

### Setting the initial field data
The wizard loads the data for each field from it's config. The `data` attribute for each field contains the that is set for the field on it's initial load. This `data` attribute has to contain the data that is set for that field in your options. When the value for the field is changed, it's stored in the wizard's state and it will remember that data when you switch the steps. 

To make the wizard load te data for the options that are already set in the back-end, you have to fill the data attributes for each field with it's current value in the options. If you do not do this the wizard will not show the actual data from the options and will not remeber the values after a refresh.

### Persisting the options
When the user goes to a another step the data for every field in the current step is send to the endpoint. The endpoint is responsible for persisting the data that is set for the fields. This is done via a PUT request that contains the json data for each field in the current step. The JSON is contains the field names and the data for each field. 

Let's say you have a step that is build up like this:

```JSON
"publishingEntity": {
  "title": "Personal Data",
  "fields" : ["nameField", "lastnameField", "adressField"]
}
```

The wizard will send a request containing the following parameters to the configured endpoint:

```JSON
{
  nameField: "John", 
  lastnameField: "Doe", 
  adressField: "Silicon valley 1", 
}
```

The configured endpoint has to process this request to store the field values.
