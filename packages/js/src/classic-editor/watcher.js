import { get, debounce, forEach } from "lodash";
import { subscribe, dispatch, select } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-integration";
import * as dom from "./helpers/dom";
import { addEventHandler as addTinyMceEventHandlers } from "../lib/tinymce";

const SYNC_DEBOUNCE_MS = 200;
const { DOM_IDS } = dom;

/**
 * Watches and syncs DOM change to the store.
 *
 * @returns {void}
 */
const watchDomChanges = () => {
	const actions = dispatch( SEO_STORE_NAME );
	/**
	 * Creates a debounced function that handles value change events on DOM elements.
	 *
	 * @param {Function} action Store action.
	 * @returns {Function} Value change event handler.
	 */
	const createHandleValueChange = ( action ) => ( event ) => debounce( action( get( event, "target.value", "" ) ), SYNC_DEBOUNCE_MS );
	/**
	 * Creates a store sync functino that subscribes to a DOM element and updates a store prop.
	 *
	 * @param {string} domId Id of DOM element.
	 * @param {Function} action Store action.
	 * @returns {void}
	 */
	const createStoreSync = ( domId, action ) => document.getElementById( domId )?.addEventListener( "change", createHandleValueChange( action ) );

	// Sync editor changes to store.
	createStoreSync( DOM_IDS.TITLE, actions.updateTitle );
	createStoreSync( DOM_IDS.EXCERPT, actions.updateExcerpt );
	createStoreSync( DOM_IDS.PERMALINK, actions.updatePermalink );
	createStoreSync( DOM_IDS.DATE, actions.updateDate );

	// Special sync to store for featured image field.
	// eslint-disable-next-line no-unused-expressions
	document.getElementById( DOM_IDS.FEATURED_IMAGE_ID )?.addEventListener( "change", ( event ) => (
		actions.updateFeaturedImage( {
			id: get( event, "target.value", "" ),
			url: dom.getFeaturedImageUrl(),
		} )
	) );

	// Special sync to store for multiple date fields.
	forEach(
		[ DOM_IDS.DATE_MONTH, DOM_IDS.DATE_DAY, DOM_IDS.DATE_YEAR ],
		( domId ) => document.getElementById( domId )?.addEventListener( "change", () => (
			actions.updateDate( window?.wp?.date?.dateI18n( "M j, Y", dom.getDate() ) ) )
		)
	);

	// Special sync to store for content TinyMCE editor.
	addTinyMceEventHandlers( DOM_IDS.CONTENT, [ "input", "change", "cut", "paste" ], createHandleValueChange( actions.updateContent ) );
};

/**
 * Watches and syncs store change to the DOM.
 *
 * @returns {void}
 */
const watchStoreChanges = () => {
	const selectors = select( SEO_STORE_NAME );
	/**
	 * Creates a debounced DOM sync function that subscribes to store changes and maybe updates a DOM element.
	 *
	 * @param {Function} selector Store selector.
	 * @param {{ domGet: Function, domSet: Function }} domLens Lens for getting or setting a DOM elements value.
	 * @returns {Function} Unsubscribe function.
	 */
	const createDomSync = ( selector, { domGet, domSet } ) => subscribe( debounce( () => {
		const storeValue = selector();
		if ( domGet() !== storeValue ) {
			domSet( storeValue );
		}
	}, SYNC_DEBOUNCE_MS ) );

	// Sync store changes to DOM.
	createDomSync( selectors.selectSeoTitle, { domGet: dom.getSeoTitle, domSet: dom.setSeoTitle } );
	createDomSync( selectors.selectMetaDescription, { domGet: dom.getMetaDescription, domSet: dom.setMetaDescription } );
	createDomSync( selectors.selectKeyphrase, { domGet: dom.getFocusKeyphrase, domSet: dom.setFocusKeyphrase } );
};

/**
 * Creates a Classic Editor watcher.
 *
 * @returns {{ watch: Function }} Watcher interface with a watch method that watches
 */
const createClassicEditorWatcher = () => ( {
	watch: () => {
		watchDomChanges();
		watchStoreChanges();
	},
} );

export default createClassicEditorWatcher;
