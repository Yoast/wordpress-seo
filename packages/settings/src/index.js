import registerGlobalAPIs, { createNavigationAPI } from "@yoast/admin-ui-toolkit/global-apis";
import { setLocaleData } from "@yoast/admin-ui-toolkit/helpers";
import "./index.css";
import initializeApp from "./initializers/app";
import initializeNavigation from "./initializers/navigation";
import initializeStore from "./initializers/store";
import { createInitialState } from "./redux/initial-state";

/**
 * Initializes the settings app.
 *
 * @param {Object} config The config object.
 * @param {Object} config.navigation The initial navigation state.
 * @param {function} config.imagePicker The imagePicker config.
 * @param {function} config.handleSave The function to handle saving data.
 * @param {function} [config.handleRouteChanged] The function to handle when the route changed.
 * @param {function} [config.applyThemeModifications] The function to apply theme modifications.
 * @param {function} [config.removeThemeModifications] The function to remove theme modifications.
 *
 * @returns {Object} Object with render function.
 */
export default function initialize( {
	notifications = [],
	navigation: configNavigation = {},
	initialRoute = "",
	imagePicker,
	options = {},
	data = {},
	handleSave,
	handleRouteChanged,
	applyThemeModifications,
	removeThemeModifications,
} ) {
	options.translations?.forEach( ( { global, domain } ) => setLocaleData( global, domain ) );

	// Expose global API on `window.yoast`.
	registerGlobalAPIs( [ createNavigationAPI() ] );

	// Create initial state based on config.
	const initialState = createInitialState( { data, options, notifications } );

	// Init store and connected router.
	initializeStore( initialState, { handleSave, handleRouteChanged, applyThemeModifications, removeThemeModifications } );

	// Create the initial navigation.
	const initialNavigation = initializeNavigation( configNavigation, initialState.options );

	/**
	 * Renders the app.
	 *
	 * @param {HTMLElement} rootElement The element to render the app in.
	 *
	 * @returns {void}
	 */
	const render = ( rootElement ) => {
		initializeApp( rootElement, { imagePicker, initialNavigation, initialRoute } );
	};

	return {
		render,
	};
}

registerGlobalAPIs( [ { settingsApp: initialize } ] );
