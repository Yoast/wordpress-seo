# Onboarding wizard
The configuration wizard is a generic library that can be used to dynamically generate an configuration wizard. The wizard and all of its underlying components are built with React in ES2015.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installing](#installing)
	- [Prerequisities](#prerequisities)
	- [Loading the wizard onto your page.](#loading-the-wizard-onto-your-page)
- [Configuring the wizard](#configuring-the-wizard)
	- [General configuration](#general-configuration)
	- [Fields](#fields)
		- [Specification](#specification)
		- [Available components](#available-components)
		- [Custom components](#custom-components)
		- [Fields definition example](#fields-definition-example)
		- [Setting the initial field data](#setting-the-initial-field-data)
	- [Steps](#steps)
		- [Specification](#specification)
		- [Steps definition example](#steps-definition-example)
	- [Translations](#translations)
	- [Persisting data](#persisting-data)
- [Accessibility](#accessibility)

<!-- /TOC -->

## Installing

### Prerequisities
The wizard depends on a few other modules/libraries. Before you start the following software has to be installed on your system:
- Node
- NPM
- Sass

### Loading the wizard onto your page.
This chapter explains how you can render the wizard onto a webpage.

Add the following line into a scss file that you load on the page.

```CSS
@import "../../node_modules/yoast-components/css/all.css";
```

Render the wizard into a `div` element on your page.

```JS
import React from "react";
import ReactDOM from "react-dom";
import ConfigurationWizard from "@yoast/configuration-wizard";

class App extends React.Component {
	render() {
		return <ConfigurationWizard { ...config }/>;
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
		return <ConfigurationWizard { ...config }/>;
	}
};
```

#### Fields definition example

```JSON
"fields": {
  "introduction": {
    "component": "HTML",
    "properties": {
      "html": "<p>Welcome to the configuration wizard!</p>"
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

#### Setting the initial field data
The wizard loads the data for each field from it's config. The `data` attribute for each field contains the intial state for that field. When the value for the field is changed, it's stored in the wizard's state and saved to the server when the user switches steps.

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
The wizard doesn't have a lot of copy of its own, but the strings in it are translatable. This is done in a similar way to [i18n Calypso - localize](https://github.com/Automattic/i18n-calypso#localize). 

The translations can be added to the config in the following way:

```JS
import { setTranslations } from "yoast-components/utils/i18n";

let translations = {
  "domain": "your-textdomain",
  "locale_data": {
    "your-textdomain": {
      "Next": ["Volgende"],
      "Previous": ["Vorige"],
      "Close": ["Sluiten"]
    }
  }
}

setTranslations( translations );
```

### Persisting data
The wizard uses API requests to send its data to the endpoint that is set via the config that is provided to the wizard. The wizard uses [jQuery](http://api.jquery.com/jquery.ajax/) for sending it's requests, but if it is not available a module called [fetch](https://github.com/github/fetch) is used.

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
  "nameField": "John", 
  "lastnameField": "Doe", 
  "adressField": "Silicon valley 1", 
}
```
The configured endpoint has to process this request to store the field values.

## Accessibility
The wizard is built with accessibility in mind. We trying to uphold a baseline level of a11y making sure it's mobile, keyboard and a screenreader accessible out of the box. All input fields in the forms have labels that are linked to them. Choice elements also have an extra screen reader text that you can add. This adds an aria-label to the options, the screenreader will read this label instead of the label that is visible on the page. This way you can add a better description for people who use a screenreader.
