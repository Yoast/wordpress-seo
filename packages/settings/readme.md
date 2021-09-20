# settings
This is a separate app for the Yoast SEO Admin. It serves all the Admin settings pages and saves via an API.

## Dev setup
After cloning this repository and a `yarn install` you can run it in development mode with `yarn dev` in this folder.
This allows you to view a compiled version in the browser. It rebuilds automatically when files change, but you have to manually refresh your browser.

## QA setup
A wrapper for testing the config is also available. Clone the repository if you haven't done so, run a `yarn install` and then you can run it in QA mode with `yarn dev --qa` in this folder.
This will start the Settings UI app (navigate to `localhost:5000`), with the option to edit the configuration, and (re)initialize the app with the new config.
Additional features may be added later, on request.

## How to implement
To implement the app, run the initializer function with the following ingredients in one config object:
* `data` the initial user/form data that should be represented in the UI.
* `options` the options of this app, controlling which parts of the UI are visible.
* `navigation` additional navigation state, this gets merged with the app's default. For the structure of this, see the `Registering a menu` section below, or the `qa/example-config.js`.
* `imagePicker` an image picker function that accepts an object with data about the currently selected image, and a callback function. Within the function the image picker of your choice should be opened, and pass new image data to the callback function upon selection of an image.
* `handleSave` the save function that the app should call when a user saves. The app will send an object with its current data state to that function. This function should return a promise of the save result object with the following content:
  * `status` that represents the request status, e.g. 200.
  * `error` object if an error occurred. It should have the same structure as the data and instead of the data it should hold an object containing the error message. See the `qa/example-config.js`.
* `handleRouteChanged` a callback function that for whenever the route changed, e.g. the user clicked on a menu item.
* Theme modifications that can be shown on the dashboard (when `options.dashboard.themeModifications` is set to `true`):
  * `applyThemeModifications` called when the user requested to apply the modifications.
  * `removeThemeModifications` called when the user requested to remove the modifications.

The initialize function will return a `render` function.
This render function should have an HTML element as argument. The HTML element should exist and it, or a parent element, should have a language direction specified, e.g. `dir=ltr`.

The initialize function will use the global `window.yoast` to expose the following API:
* `navigation.registerGroup` see the `Registering a menu` section below.
* `navigation.registerItem` see the `Registering a menu` section below.

## How to extend
*The description below is a work in progress and indicates a general direction rather than a hard contract.*

In order to extend the app, you have the following options.

### Content Type support
You can add content type support with the `initialize` function.
In the configuration object you pass to this function, add a prop inside `options` named `contentTypes`. This prop should be an object with slugs as keys, and the content type options that belong to that slug.
Each content type options object should look like this (with defaults):

```js
{
	slug: "" // <- Required
	label: "", // <- Required
	hasSinglePage: true,
	hasArchive: false,
	hasBreadcrumbs: true,
	hasCustomFields: false,
	hasSchemaPageTypes: true,
	hasSchemaArticleTypes: true,
	hasAutomaticSchemaTypes: false, // Show an alert notifying the user of what the schema types will be instead of selects.
	contentTypeSchemaInfoLink: "", // Only used when `hasAutomaticSchemaTypes is true.
	hasSocialAppearance: false,
	singleSupportedVariables: [],
	archiveSupportedVariables: [],
	defaults: {
		schema: {
			pageType: "WebPage",
			articleType: "",
		},
		templates: {
			seo: {
				single: {
					title: "",
					description: "",
				},
				archive: {
					title: "",
					description: "",
				},
			},
			social: {
				single: {
					title: "",
					description: "",
					image: { url: "" },
				},
				archive: {
					title: "",
					description: "",
					image: { url: "" },
				},
			},
		},
	},
}
```

If you add content type support this way, each content type will get a route under 'Content Settings' in the main navigation.
The form fields rendered per content type differ based on the options you passed.

### Registering a menu (or a menu item).
You can register a collapsible menu section by calling `window.yoast.navigation.registerGroup( { icon, label, key, priority, isDefaultOpen = true, children = [] } )`.
* `icon` should be a renderable icon component. 
* `label` is the visible label for the menu group.
* `key` should be a unique identifier string for this collapsible menu.
* `priority` is a number value to determine how high in the menu the collapsible should be rendered. Higher values mean a spot closer to the top.
* `isDefaultOpen` is a boolean to determine whether the collapsible should start open or closed.
* `children` is an array of objects, with a composition identical to the arguments for `registerNavItem`, minus the `groupKey`.

You can register a submenu item by calling `window.yoast.navigation.registerItem( { key, groupKey, label, target, component, priority = 0 } )`. 
* `label` is the visible label for the menu item.
* `target` is the relative URL path the menu item should link to.
* `key` should be a unique identifier string for this specific menu item.
* `groupKey` should be the unique identifier string of the collapsible menu group this item belongs to.
* `priority` is a number value to determine how high in the menu group the item should be rendered. Higher values mean a spot closer to the top.
* `component` is a container component, responsible for its own data.
* `props` are props to pass to the component, optional.

### Adding settings to existing pages.
Note: this is not exposed at this time.
We also provide a number of Slots you can add a Fill to, in order to show settings on the existing pages. You can register a fill by calling `registerFill( name, Component, priority = 10 )`.
* `name` is the name of the slot where you want the Component to be rendered.
* `Component` is the component that you want rendered.
* `priority` is the priority of the fill, this will be used by the slot to sort the fills on.

It is important to note we offer only a place for you to render your component. We don't handle any data for these fills.

Currently, we offer the following slots:
* `schema.breadcrumbs`, which renders on the bottom of the `Schema` -> `Breadcrumbs` page.

### Registering a custom data callback
Note: this is not exposed at this time.
You can register a custom data callback by calling `registerCustomDataCallback( callback )`.

The callbacks get called when the user requests a save. We then merge it with our data and call the configured save function with the result.
