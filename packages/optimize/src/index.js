import registerGlobalAPIs, { createNavigationAPI } from "@yoast/admin-ui-toolkit/global-apis";
import { setLocaleData } from "@yoast/admin-ui-toolkit/helpers";
import { noop } from "lodash";
import { createContentTypesWithDefaults } from "./helpers";
import "./index.css";
import initializeApp from "./initializers/app";
import initializeNavigation from "./initializers/navigation";
import initializeStore from "./initializers/store";
import createInitialState from "./redux/initial-state";

/**
 * Initializes the content-list app.
 *
 * @param {Object} config The config object.
 * @param {function} config.handleQuery The function to handle query changes.
 * @param {function} config.handleSave The function to handle saving data.
 * @param {function} config.getDetail The function to get detail data.
 * @param {function} config.runAnalysis The function to run an analysis.
 * @param {function} config.runRelatedKeyphraseAnalysis The function to run an analysis on the related keyphrases.
 * @param {function} config.handleRouteChanged The function to handle when the route changed.
 * @param {Object} config.navigation The initial navigation state.
 * @param {Object} config.initialRoute The requested initial navigation route.
 * @param {Object} config.contentTypes The content types to display.
 * @param {Object} config.settings The user settings configured in Settings UI.
 * @param {Object} config.options The general options.
 *
 * @returns {Object} Object with the render function.
 */
export default function initialize( {
	handleQuery,
	handleSave,
	getDetail,
	runAnalysis,
	runRelatedKeyphraseAnalysis,
	runResearch,
	handleRouteChanged,
	navigation = {},
	initialRoute = "",
	contentTypes: rawContentTypes = {},
	settings = {},
	options = {},
	imagePicker = noop,
	notifications = [],
} ) {
	options.translations?.forEach( ( { global, domain } ) => setLocaleData( global, domain ) );

	// Create global APIs on 'window.yoast'
	registerGlobalAPIs( [ createNavigationAPI() ] );

	const contentTypes = createContentTypesWithDefaults( rawContentTypes );
	const initialState = createInitialState( { contentTypes, settings, options, notifications } );
	// Initialize the Redux store
	initializeStore( initialState, {
		handleQuery,
		handleSave,
		getDetail,
		runAnalysis,
		runRelatedKeyphraseAnalysis,
		runResearch,
		handleRouteChanged,
	} );
	const initialNavigation = initializeNavigation( { navigation, contentTypes } );

	/**
	 * Renders the app.
	 *
	 * @param {HTMLElement} rootElement The element to render the app in.
	 *
	 * @returns {void}
	 */
	const render = ( rootElement ) => {
		initializeApp( rootElement, { initialNavigation, initialRoute, imagePicker } );
	};

	return {
		render,
	};
}

registerGlobalAPIs( [ { optimizeApp: initialize } ] );
