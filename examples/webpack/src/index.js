// Internal dependencies.
import './index.css';
import App from './App';
import configureStore from "./redux/utils/store";
import { renderReactApp } from "./redux/utils/render";
import { createStorageMiddleware, getStorageData } from "./redux/utils/localstorage";

const storageStates = [
	"configuration",
	"paper",
];
const preloadedState = {
	configuration: {
		useKeywordDistribution: true,
	},
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

const initialState = getStorageData( storageStates, preloadedState );
const storageMiddleware = createStorageMiddleware( storageStates );

const store = configureStore( initialState, [ storageMiddleware  ] );
const targetElement = document.getElementById( "root" );

renderReactApp( targetElement, App, store );
