// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { actions, reducers, selectors } from "@yoast/externals/redux";
import { defaultsDeep, get, reduce } from "lodash";
import {
	getInitialLinkParamsState,
	getInitialNotificationsState,
	getInitialPluginUrlState,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
	NOTIFICATIONS_NAME,
	notificationsActions,
	notificationsReducer,
	notificationsSelectors,
	PLUGIN_URL_NAME,
	pluginUrlActions,
	pluginUrlReducer,
	pluginUrlSelectors,
	WISTIA_EMBED_PERMISSION_NAME,
} from "../../shared-admin/store";
import { STORES } from "../constants";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( initialState = {} ) => {
	return createReduxStore( STORES.editor, {
		actions: {
			...actions,
			...linkParamsActions,
			...notificationsActions,
			...pluginUrlActions,
		},
		selectors: {
			...selectors,
			...linkParamsSelectors,
			...notificationsSelectors,
			...pluginUrlSelectors,
		},
		initialState: defaultsDeep(
			{},
			initialState,
			// Retrieve the default state from the reducers.
			reduce( reducers, ( state, reducer, name ) => {
				// eslint-disable-next-line no-undefined
				state[ name ] = reducer( undefined, {} );
				return state;
			}, {} ),
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ NOTIFICATIONS_NAME ]: getInitialNotificationsState(),
				[ PLUGIN_URL_NAME ]: getInitialPluginUrlState(),
			}
		),
		reducer: combineReducers( {
			...reducers,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ NOTIFICATIONS_NAME ]: notificationsReducer,
			[ PLUGIN_URL_NAME ]: pluginUrlReducer,
		} ),
		controls: {},
	} );
};

/**
 * @returns {Object} The state.
 */
const getExternalState = () => ( {
	activeMarker: "hidden",
	currentPromotions: {
		promotions: get( window, "wpseoScriptData.currentPromotions", [] ),
	},
	dismissedAlerts: get( window, "wpseoScriptData.dismissedAlerts", {} ),
	// TODO: Refactor to use the preferences?
	isPremium: Boolean( get( window, "wpseoScriptData.metabox.isPremium", false ) ),
	// TODO: There are value below that come in via our hidden fields in the editor. Add those fields or rework.
	isCornerstone: false,
	focusKeyword: "",
	facebookEditor: {
		title: get( window, "wpseoScriptData.metabox.social_title_template", "" ),
		description: get( window, "wpseoScriptData.metabox.social_description_template", "" ),
		image: {
			id: "",
			url: "",
		},
	},
	twitterEditor: {
		title: get( window, "wpseoScriptData.metabox.social_title_template", "" ),
		description: get( window, "wpseoScriptData.metabox.social_description_template", "" ),
		image: {
			id: "",
			url: "",
		},
	},
	snippetEditor: {
		data: {
			title: get( window, "wpseoScriptData.metabox.title_template", "" ),
			description: get( window, "wpseoScriptData.metabox.metadesc_template", "" ),
		},
	},
	// END TODO
	preferences: {
		isCornerstoneActive: get( window, "wpseoScriptData.metabox.cornerstoneActive", false ) === 1,
		isWoocommerceActive: get( window, "wpseoScriptData.isWooCommerceActive", false ) === "1",
		isAdvancedSettingsActive: get( window, "wpseoAdminL10n.displayAdvancedTab", false ) === "1",
		isInsightsEnabled: Boolean( get( window, "wpseoScriptData.metabox.isInsightsEnabled", false ) ),
		isPremium: Boolean( get( window, "wpseoScriptData.metabox.isPremium", false ) ),
		isPost: get( window, "wpseoScriptData.isPost", false ) === "1",
		isTerm: get( window, "wpseoScriptData.isTerm", false ) === "1",
	},
	settings: {
		socialPreviews: {
			sitewideImage: get( window, "wpseoScriptData.metabox.sitewide_social_image", "" ),
			siteName: get( window, "wpseoScriptData.metabox.site_name", "" ),
			contentImage: get( window, "wpseoScriptData.metabox.first_content_image", "" ),
			twitterCardType: get( window, "wpseoScriptData.metabox.twitterCardType", "" ),
		},
		snippetEditor: {
			baseUrl: get( window, "wpseoScriptData.metabox.base_url", "" ),
			date: get( window, "wpseoScriptData.metabox.metaDescriptionDate", "" ),
			recommendedReplacementVariables: get( window, "wpseoScriptData.analysis.plugins.replaceVars.recommended_replace_vars", [] ),
			siteIconUrl: get( window, "wpseoScriptData.metabox.siteIconUrl", "" ),
		},
	},
	SEMrushRequest: {
		countryCode: get( window, "wpseoScriptData.metabox.countryCode", "" ),
		isLoggedIn: Boolean( get( window, "wpseoScriptData.metabox.SEMrushLoginStatus", false ) ),
	},
	WincherRequest: {
		isLoggedIn: Boolean( get( window, "wpseoScriptData.metabox.wincherLoginStatus", false ) ),
	},
	WincherSEOPerformance: {
		automaticallyTrack: Boolean( get( window, "wpseoScriptData.metabox.wincherAutoAddKeyphrases", false ) ),
		websiteId: get( window, "wpseoScriptData.metabox.wincherWebsiteId", "" ),
	},
	[ LINK_PARAMS_NAME ]: get( window, "wpseoScriptData.linkParams", {} ),
	[ PLUGIN_URL_NAME ]: get( window, "wpseoScriptData.pluginUrl", "" ),
	[ WISTIA_EMBED_PERMISSION_NAME ]: {
		value: get( window, "wpseoScriptData.wistiaEmbedPermission", false ) === "1",
	},
} );

/**
 * Registers the store to WP data's default registry.
 * @param {WPDataStore} store The data store.
 * @returns {void}
 */
const registerStore = ( store ) => {
	register( store );
};

/**
 * Initializes the store: create, populate and register.
 * @returns {WPDataStore} The store.
 */
export const initializeStore = () => {
	const store = createStore( getExternalState() );
	registerStore( store );
	return store;
};
