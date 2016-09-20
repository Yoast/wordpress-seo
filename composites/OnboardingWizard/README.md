# Onboarding wizard
The onboarding wizard is a generic library that can be used to dynamically generate an installation wizard. The wizard and all of its underlying components should be built with React in ES2015, using Babel to transpile the code to ES5. For consistency we will use browserify to manage JS modules

## Installing
This chapter tells what you have to do to get a working version of the onboarding wizard running.

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
The config determines the steps that are rendered by the wizard. This chapter explains what elements the config can or has to contain in order to work.

### General config
The basic elements that the wizard needs in to render a wizard are described in this section.

  - Required:
    - `endPoint`, _string_, The REST-API endpoint for the wizard to send the results for the steps to.
    - `finishUrl`, _string_, The finish URL for the wizard to redirect the user to after completing/closing the wizard. 
    - `fields`, _object_, The fields that can or will be included in the steps.
    - `steps`, _object_, The steps are build out of fields.
    - `endpoint`, _string_, The URL endpoint used to save the data which is submitted by the user.
  - Optional:
    - `customComponents`, _object_, Custom components are used for adding your own (environment specific) components to the wizard.

### Steps
The wizard renders a couple of steps the user can go through to configure it's settings based on questions. Each step contains a number of fields. The fields are for example Choice, Input or HTML components, but can also be custom components.

- A `Step` has the following attributes:
  - `id`, _string_, identifier
  - `title`, _string_, the title of the step.
  - `fields`, _array_, list of strings referencing fields by key. 

```
"steps": {
    "publishingEntity": {
      "title": "Company or person",
      "fields" : ["publishingEntity"]
    },
    "profileUrls": {
      "title": "Social profiles",
      "fields" : [
        "profileUrlFacebook",
      ]
    },
    "environment": {
      "title": "Environment",
      "fields": ["environment"]
    },
```

### Fields
This is the information for the different elements that the wizard can render in the steps:
- A `field` has the following attributes:
  - `component`, _string_, references the component that should be used to render the field in the component tree.
  - `properties`, _object_, contains all the metadata needed to render the component and configure its behavior. The properties are passed to the components. For example this can be a label or explanation.
  - `requires`, _object_, The name of another field that is required to have a certain value for this field to be rendered.
  	- `field`, _string_, The field name for the other field.
  	- `value`, _string_, The value this field has to have.
  - `data`, _mixed_, the value of the field. This used to store the values for the different fields and this value is also send via the REST-API for storing the information.

Some examples for how to define fields:
```
  "fields": {
    "upsellConfigurationService": {
      "component": "HTML",
      "properties": {
        "html": "You can now have Yoast configure Yoast SEO for you."
      }
    },
    "environment": {
      "component": "Choice",
      "properties": {
        "label": "Please specify the environment {site_url} is running in.",
        "choices": {
          "production": {
            "label": "Production - live site."
          },
          "staging": {
            "label": "Staging - copy of live site used for testing purposes only."
          },
          "development": {
            "label": "Development - locally running site used for development purposes."
          }
        },
      },
      "data": "",
      "default": "production"
    },
    "profileUrlFacebook": {
      "component": "Input",
      "properties": {
        "label": "Facebook page url",
        "pattern": "^https:\/\/www\.facebook\.com\/([^/]+)\/$"
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
 
### Generic components
Right now the wizard contains three different elements that can be used. A HTML element that renders an HTML element containing some text, a Choice element that for example renders radio buttons or an Input element for text input by the user.
  - `HTML`
    The `HTML` component takes a piece of HTML and renders it. This should be used to render some paragraph of text in the steps.
    - __Properties__:
      - `html`: The html to be rendered.
  - `Choice`
    The `Choice` component renders a choice interface, like a group of radio buttons or a select button.
    - __Properties__:
      - `label`: The label for the input element to be rendered.
      - `choices`: a JSON string with choices where the key represents the `value` and the value is an object with `choice` properties:
        - `label`, _string_, The label of the choice.
        - `explanation`, _string_, (optional) An extra explanation that is shown underneath the choice field.
        - `screenReaderText`, _string_, (optional) Extra context for people using screenreaders.
  - `Input`
    The `Input` component renders a textarea.
    - __Properties__:
      - `label`: The label for the input element to be rendered.
      - `placeholder`: placeholder text.
      - `pattern`: a regular expression that can be used to validate the string format. (not MVP)

### Custom components
It is possible to inject custom component modules into the `Wizard`. The custom components have to be React elements that can be rendered by the Wizard. They should be implemented by yourself, required and injected when instantiating the Wizard. Below is an example for how to add your custom components to the wizard's config.

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
The text for the different elements in the wizard can be tanslated. For you have to add the translations to the config that the wizard uses.

Example:
```
import { setTranslations } from "yoast-components/utils/i18n";
import isUndefined from "lodash/isUndefined";

if ( ! isUndefined( yoastWizardConfig.translations ) ) {
	setTranslations( yoastWizardConfig.translations );
}
```

## Set-up an REST-API endpoint
The wizard uses a API requests to send it's data to the endpoint that is set via the config that is provided to the wizard. Every time the user goes to another step, current user data is send. This is done via a PUT request that contains the json data for each field in the current step.

```
{
  postTypeVisibility: "", 
  postTypePost: "false", 
  postTypePage: "false", 
  postTypeAttachment: "false"
}
```

## Accesibility

```
until finished
```

