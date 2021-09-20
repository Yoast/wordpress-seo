# **`content-list`**
This is a separate content-list app. It gives you a navigation of collections and serves a listing UI for each.


## Development setup
After cloning this repository and a `yarn install` you can run it in development mode with `yarn dev` in this folder.
This allows you to view a compiled version in the browser. It rebuilds automatically when files change, but you have to manually refresh your browser.

```sh
yarn install && yarn dev
```


## Configuring the app
To implement the app, run the initializer function with a config object to customize the instance. Supported props are:


#### **`config.handleQuery`** `Function`
The `handleQuery` function is responsible for fetching data based on a query. Search, filtering, sorting and paginating actions are fired within the app to alter the query and trigger new executions of this `handleQuery` function.

The `handleQuery` function receives one argument, the **query data** object, with the following shape:

```js
{
	contentType: "products",
	page: 1,
	filters: {
		status: "published",
		seoScore: "ok",
	},
	sortBy: {
		column: "date",
		direction: "desc",
	},
	searchTerm: "Foo Bar",
}
```

The `handleQuery` should return a **success** response with the following shape:

```js
{
	status: 200,
	data: {
		items: [
			{
				id: "1",
				title: "Product 1",
                ...
			}
		],
		moreItemsAvailable: true
	}
}
```

or a **error** response with the following shape:

```js
{
	status: 400, // Or another valid error HTML response code
	error: {
		message: "Something terrible has happened"
	},
}
```


#### **`navigation`** `Object`


#### **`contentTypes`** `Object`
An object of content type configuration objects, keyed with their own slug. Use it to customize which content types are supported and which table columns and filters are available.
In example, the following code adds support for a `products` content type with the 4 different column types and filters defined:

```js
{
	products: {
		slug: "products",
		label: "Products",
		labelSingular: "Product",
		columns: [
			{
				key: "image",
				label: __( "Image", "admin-ui" ),
				sortable: false,
				type: "thumbnail",
			},
			{
				key: "title",
				label: __( "Title", "admin-ui" ),
				sortable: true,
				type: "",
			},
			{
				key: "date",
				label: __( "Date", "admin-ui" ),
				sortable: true,
				type: "date",
			},
			{
				key: "seoScore",
				icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke="none" fill="currentColor" className="yst-w-5 yst-h-5 yst-mx-auto yst-text-gray-500"><path key="outerPath" d="M13.56 0H7a3.5 3.5 0 0 0-3.34 3.4v13.16A3.41 3.41 0 0 0 7.06 20h6.5A3.41 3.41 0 0 0 17 16.56V3.4A3.51 3.51 0 0 0 13.56 0zm1.9 16.08a2.37 2.37 0 0 1-2.35 2.37H7.52a2.37 2.37 0 0 1-2.35-2.37V3.86a2.37 2.37 0 0 1 2.35-2.37h5.59a2.37 2.37 0 0 1 2.35 2.37z" /> <circle key="circle1" cx="10.31" cy="9.98" r="2.15" /> <circle key="circle2" cx="10.31" cy="4.69" r="2.15" /> <circle key="circle3" cx="10.31" cy="15.31" r="2.15" /></svg>,
				label: __( "SEO score", "admin-ui" ),
				sortable: false,
				type: "score",
			},
		],
		filters: [
			{
				key: "status",
				values: [ "all", "active", "draft", "archive" ],
			}, {
				key: "seoScore",
				values: [ "needsImprovement", "ok", "good", "noFocusKeyphrase", "noIndex" ],
			}, {
				key: "readabilityScore",
				values: [ "needsImprovement", "ok", "good" ],
			}
		], // <- default
		hasSchemaPageTypes: false, // <- default
		hasSchemaArticleTypes: false, // <- default
		hasAutomaticSchemaTypes: false, // <- default
		hasReadabilityAnalysis: true, // <- default
		hasSeoAnalysis: true, // <- default
		hasRelatedKeyphrases: true, // <- default
		hasCornerstone: true, // <- default
	}
}

// OR

{
	products: {
		slug: "products",
		label: "Products", 
		labelSingular: "Product",
		// Omit default columns and filters
	}
}
```

#### **`config.handleRouteChanged`** `Function`
A callback function that for whenever the route changed, e.g. the user clicked on a menu item.

## Extending the app
To implement the app, run the initializer function with a config object to customize the instance. Supported props are:
