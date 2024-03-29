// Base style.
import "./index.css";

// External dependencies.
import AnalysisWorkerWrapper from "yoastseo/src/worker/AnalysisWorkerWrapper";

// Internal dependencies.
const AnalysisWebWorker = require( "./analysis.worker" );
import App from "./App";
import { createStorageMiddleware, getStorageData } from "./redux/utils/localstorage";
import { renderReactApp } from "./redux/utils/render";
import configureStore from "./redux/utils/store";
import StoreSubscriber from "./redux/utils/StoreSubscriber";


const storageStates = [
	"configuration",
	"options",
	"paper",
	"performance",
];
const preloadedState = {
	configuration: {
		useCornerstone: false,
		useTaxonomy: false,
		useKeywordDistribution: true,
		logLevel: "debug",
	},
	options: {
		isRelatedKeyphrase: false,
		isTreeBuilderEnabled: false,
		useMorphology: true,
	},
	paper: {
		text: "",
		title: "",
		description: "",
		keyword: "",
		synonyms: "",
		locale: "",
		slug: "",
		permalink: "https://example.org/",
	},
	performance: {
		batchSize: 50,
		researches: [],
		results: {},
	},
};

const initialState = getStorageData( storageStates, preloadedState );
const storageMiddleware = createStorageMiddleware( storageStates );

const store = configureStore( initialState, [ storageMiddleware ] );
const workerUnwrapped = new AnalysisWebWorker();
// Pass language so that the right researcher is loaded.
workerUnwrapped.postMessage( { language: window.localStorage.language } );
const worker = new AnalysisWorkerWrapper( workerUnwrapped );

const subscriber = new StoreSubscriber( { store, worker } );
subscriber.subscribe();


const targetElement = document.getElementById( "root" );
renderReactApp( targetElement, App, { store, worker } );
