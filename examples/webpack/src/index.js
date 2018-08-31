// Internal dependencies.
import "./index.css";
import App from "./App";

import configureStore from "./redux/utils/store";
import { renderReactApp } from "./redux/utils/render";
import StoreSubscriber from "./redux/utils/StoreSubscriber";
import { createStorageMiddleware, getStorageData } from "./redux/utils/localstorage";
import AnalysisWorkerWrapper from "../../../src/worker/AnalysisWorkerWrapper";
import AnalysisWebWorker from "./analysis.worker";

const storageStates = [
	"configuration",
	"paper",
];
const preloadedState = {
	configuration: {
		useKeywordDistribution: false,
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
const worker = new AnalysisWorkerWrapper( new AnalysisWebWorker() );
const subscriber = new StoreSubscriber( { store, worker } );
subscriber.subscribe();


const targetElement = document.getElementById( "root" );
renderReactApp( targetElement, App, { store, worker } );
