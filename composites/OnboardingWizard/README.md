# Onboarding wizard
The onboarding wizard is a generic library that can be used to dynamically generate an installation wizard. The wizard and all of its underlying components are built with React in ES2015.

## Installing
This chapter tells what you have to do to get a working version of the onboarding wizard running.

### Prerequisities
The wizard depends on a few other modules/libraries. Before you start the following software has to be installed on your system:
- Node
- NPM
- SASS


#### React tap event plugin
Some components use [react-tap-event-plugin](https://github.com/zilverline/react-tap-event-plugin) to listen for touch events because onClick is not fast enough This dependency is temporary and will eventually go away. Until then, be sure to inject this plugin at the start of your app.

```
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
```

### Loading the wizard onto your page.
This chapter explains how you can render the wizard onto a webpage.

The following modules have to be installed and added to your package.json:
- react
- material-ui
- react-tap-event-plugin
- Yoast/yoast-components

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
The config determines the steps that are rendered by the wizard. This chapter explains what elements the config can or has to contain in order to work.

### General config
The wizard needs some basic elements in order for the wizard to be rendered. These are the following elements:

  - Required elements:
    - `finishUrl`, _string_, The finish URL for the wizard to redirect the user to after completing/closing the wizard. 
    - `fields`, _object_, The fields are components that can be rendered in the steps.
    - `steps`, _object_, The steps contain one or more fields.
    - `endpoint`, _string_, The endpoint URL used to save the data which is submitted by the user.
  - Optional elements:
    - `customComponents`, _object_, Custom components are used for adding your own (environment specific) components to the wizard.

### Fields
The fields are the components that contain the information in the steps. They are for example generic compontents like Choice, Input or HTML components, but can also be custom components. The fields are defined as an object in the config. Each field is defined as an object and has the following attributes:
 - `name`, _string_, the name for the field.
      - `component`, _string_, references the component that should be used to render the field in the component tree.
      - `properties`, _object_, contains all the metadata needed to render the component and configure its behavior. The properties are passed to the components. For example this can be a label or explanation.
      - `requires`, _object_, (optional) the name of another field that is required to have a certain value for this field to be rendered.
      	- `field`, _string_, the field name for the other field.
      	- `value`, _string_, the value this field has to have.
      - `data`, _mixed_, the value of the field. This used for the intial values for the different field and contains the actual data from the server.

After defining the different fields you can add the fields to the steps. This is described in the next chapter about 'Steps'. Below are some examples for how to define fields in the wizard's config:
```
  "fields": {
    "introduction": {
      "component": "HTML",
      "properties": {
        "html": "Welcome to the onboarding wizard!"
      }
    },
    "gender": {
      "component": "Choice",
      "properties": {
        "label": "What is your gender?",
        "choices": {
          "male": {
            "label": "Male"
          },
          "female": {
            "label": "Female"
          },
        },
      },
      "data": "",
      "default": "male"
    },
    "profileUrlFacebook": {
      "component": "Input",
      "properties": {
        "label": "Facebook profile URL",
      },
      "data": "{profile_url_facebook}"
    },
    "businessPublishingEntity": {
      "componentName": "Input",
      "conditionalType": "TextField",
      "properties": {
        "label": "The company name:",
        "pattern": "*",
      },
      "requires": {
        "field": "publishingEntity",
        "value": "company",
      }
},
```

### Steps
The wizard renders a couple of steps the user can go through to configure it's settings based on questions. The steps display the different fields that ask in information from or give information to the user. A Step has the following attributes:
  - `id`, _string_, identifier
      - `title`, _string_, the title of the step.
      - `fields`, _array_, list of strings referencing fields by key. 

As an example I'll use the fields from the previous chapter. In the config you could define the steps like this:
```
"steps": {
    "intro": {
      "title": "Introduction",
      "fields" : ["introduction", "publishingEntity"]
    },
    "personalData": {
      "title": "Personal data",
      "fields" : ["gender", "profileUrlFacebook"]
    },
```
 
### Generic components
Right now the wizard contains three different elements that can be used. A HTML component that renders an HTML element containing some text, a Choice component that  renders radio buttons or an Input element for text input by the user.
  - `HTML`
    Takes a piece of HTML and renders it. This should be used to render some paragraph of text in the steps.
    - __Properties__:
      - `html`: The html to be rendered.
  - `Choice`
    Renders a choice interface, like a group of radio buttons or a select button.
    - __Properties__:
      - `label`: The label for the input element to be rendered.
      - `choices`: a JSON string with choices where the key represents the `value` and the value is an object with `choice` properties:
        - `label`, _string_, The label of the choice.
        - `explanation`, _string_, (optional) An extra explanation that is shown underneath the choice field.
        - `screenReaderText`, _string_, (optional) Extra context for people using screenreaders.
  - `Input`
    Renders a textarea.
    - __Properties__:
      - `label`: The label for the input element to be rendered.
      - `placeholder`: placeholder text.
      - `pattern`: a regular expression that can be used to validate the string format. (not MVP)

### Custom components
It is possible to inject custom component modules into the `Wizard`. The custom components have to be React elements that can be rendered by the wizard. They should be implemented by yourself and they can be required and injected when instantiating the Wizard. Below is an example for how to add your custom components to the wizard's config.

```
import CustomComponent1 form "/exmpample/path/CustomComponent1"
import CustomComponent2 form "/exmpample/path/CustomComponent2"

"customComponents": {
    CustomComponent1,
    CustomComponent2
  }
  
yoastWizardConfig.customComponents = customComponents;
```

### Translations
The text for the different elements in the wizard can be tanslated. The wizard uses the same priciple as [i18n calipso - localize](https://github.com/Automattic/i18n-calypso#localize) uses. 

The translations have to be added to the config that the wizard uses:
```
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

```
"publishingEntity": {
      "title": "Personal Data",
      "fields" : ["nameField", "lastnameField", "adressField"]
    },
```
The wizard will send a request containing the following parameters to the configured endpoint:
```
{
  nameField: "John", 
  lastnameField: "Doe", 
  adressField: "Silicon valley 1", 
}
```
The configured endpoint has to process this request to store the field values.
