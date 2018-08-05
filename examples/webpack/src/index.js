// External dependencies.
import { save, load } from "redux-localstorage-simple";

// Internal dependencies.
import './index.css';
import App from './App';
import configureStore from "./redux/utils/store";
import { renderReactApp } from "./redux/utils/render";

const storageConfig = {
	states: [
		"configuration",
		"paper",
	],
	namespace: "YoastSEO_JS_Example",
};
const preloadedState = {
	paper: {
		text: "",
		title: "",
		description: "",
		keyword: "",
		synonyms: "",
		locale: "",
		url: "https://example.org/",
		permalink: "example-post",
	},
};

const initialState = load( {
	...storageConfig,
	preloadedState,
	disableWarnings: true,
} );
const storageMiddleware = save( storageConfig );

const store = configureStore( initialState, [ storageMiddleware ] );
const targetElement = document.getElementById( "root" );

renderReactApp( targetElement, App, store );
