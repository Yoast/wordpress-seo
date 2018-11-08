// Base style.
import "./index.css";

// External dependencies.
import AnalysisWorkerWrapper from "yoastsrc/worker/AnalysisWorkerWrapper";

// Internal dependencies.
import AnalysisWebWorker from "./analysis.worker";
import App from "./App";
import { createStorageMiddleware, getStorageData } from "./redux/utils/localstorage";
import { renderReactApp } from "./redux/utils/render";
import configureStore from "./redux/utils/store";
import StoreSubscriber from "./redux/utils/StoreSubscriber";

const storageStates = [
	"configuration",
	"paper",
];
const preloadedState = {
	configuration: {
		useKeywordDistribution: true,
		logLevel: "debug",
	},
	paper: {
		text: "",
		title: "",
		description: "",
		keyword: "",
		synonyms: "",
		locale: "",
		url: "",
		permalink: "https://example.org/",
	},
};

const initialState = getStorageData( storageStates, preloadedState );
const storageMiddleware = createStorageMiddleware( storageStates );

const store = configureStore( initialState, [ storageMiddleware  ] );
const worker = new AnalysisWorkerWrapper( new AnalysisWebWorker() );

const subscriber = new StoreSubscriber( { store, worker } );
subscriber.subscribe();


const targetElement = document.getElementById( "root" );
renderReactApp( targetElement, App, { store, worker } );
