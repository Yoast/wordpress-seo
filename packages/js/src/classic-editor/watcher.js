/* eslint-disable no-unused-expressions */
import { get, set, debounce, forEach, isEqual } from "lodash";
import { subscribe, dispatch, select } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-integration";
import { addEventHandler as addTinyMceEventListener, getContentTinyMce } from "../lib/tinymce";
import * as dom from "./helpers/dom";

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
	 * @param {Function} action Store action to dispatch.
	 * @returns {Function} Value change event handler.
	 */
	const createHandleValueChange = ( action ) => debounce( ( event ) => action( get( event, "target.value", "" ) ), SYNC_DEBOUNCE_MS );

	/**
	 * Creates a store sync that subscribes to DOM changes and maybe dispatches an store action.
	 *
	 * @param {string} domId Id of DOM element to listen to.
	 * @param {Function} action Store action to dispatch.
	 * @param {string} [eventName] Event name to add listener to.
	 * @returns {void}
	 */
	const createStoreSync = ( domId, action, eventName = "change" ) => document.getElementById( domId )?.addEventListener(
		eventName,
		createHandleValueChange( action )
	);

	// Sync simple editor changes to store.
	createStoreSync( DOM_IDS.TITLE, actions.updateTitle, "input" );
	createStoreSync( DOM_IDS.EXCERPT, actions.updateExcerpt, "input" );

	// Sync featured image to store, note the transform.
	document.getElementById( DOM_IDS.FEATURED_IMAGE_ID )?.addEventListener( "change", ( event ) => (
		actions.updateFeaturedImage( {
			id: get( event, "target.value", "" ),
			url: dom.getFeaturedImageUrl(),
		} )
	) );

	// Sync multiple slug fields changes to store.
	forEach(
		[ DOM_IDS.SLUG, DOM_IDS.SLUG_NEW_POST, DOM_IDS.SLUG_EDIT_POST ],
		( domId ) => createStoreSync( domId, actions.updateSlug )
	);

	// Sync multiple date fields changes to store.
	forEach(
		[ DOM_IDS.DATE_MONTH, DOM_IDS.DATE_DAY, DOM_IDS.DATE_YEAR ],
		( domId ) => document.getElementById( domId )?.addEventListener( "change", () => actions.updateDate( dom.getDate() ) )
	);

	/**
	 * Creates a debounced function that handles value change events on Tiny MCE editors.
	 *
	 * @param {string} domId Id of DOM element.
	 * @param {Function} action Store action.
	 * @returns {Function} Value change event handler.
	 */
	const createHandleTinyMceValueChange = ( domId, action ) => debounce( () => action( getContentTinyMce( domId ) ), SYNC_DEBOUNCE_MS );
	const tinyMceEventNames = [ "input", "change", "cut", "paste" ];

	// Sync TinyMCE editor changes to store.
	forEach(
		[ DOM_IDS.CONTENT, DOM_IDS.CONTENT_TERM ],
		( domId ) => {
			const editor = window?.tinymce?.editors?.[ domId ];
			const handleEvent = createHandleTinyMceValueChange( domId, actions.updateContent );
			if ( editor ) {
				// If editor already initialized, go ahead and listen for events.
				return forEach( tinyMceEventNames, ( eventName ) => editor?.on( eventName, handleEvent ) );
			}
			// Fallback to adding event listeners when editor with id is initialized.
			addTinyMceEventListener( domId, tinyMceEventNames, handleEvent );
		}
	);
};

/**
 * Watches and syncs store change to the DOM.
 *
 * @returns {void}
 */
const watchStoreChanges = () => {
	const selectors = select( SEO_STORE_NAME );
	let cache = {};

	/**
	 * Creates a debounced DOM sync that subscribes to store changes and maybe updates a DOM element.
	 *
	 * @param {Function} selector Store selector to listen to.
	 * @param {{ domGet: Function, domSet: Function }} domLens Lens for getting and setting DOM element values.
	 * @param {string} [cacheKey] Optional key to use in the cache.
	 * @returns {Function} Unsubscribe from store function.
	 */
	const createDomSync = ( selector, { domGet, domSet }, cacheKey = "" ) => subscribe( debounce( () => {
		const cacheValue = get( cache, cacheKey );
		const storeValue = selector();

		if ( isEqual( cacheValue, storeValue ) ) {
			// No store change.
			return false;
		}

		if ( isEqual( domGet(), storeValue ) ) {
			// Store change is alreday in DOM.
			return false;
		}

		// Update DOM if store value changed.
		domSet( storeValue );
		// Update cache if cache key exists.
		cache = cacheKey ? set( cache, cacheKey, storeValue ) : cache;
	}, SYNC_DEBOUNCE_MS ) );

	// Sync simple store changes to hidden inputs.
	createDomSync( selectors.selectSeoTitle, { domGet: dom.getSeoTitle, domSet: dom.setSeoTitle }, "seoTitle" );
	createDomSync( selectors.selectMetaDescription, { domGet: dom.getMetaDescription, domSet: dom.setMetaDescription }, "metaDescription" );
	createDomSync( selectors.selectKeyphrase, { domGet: dom.getFocusKeyphrase, domSet: dom.setFocusKeyphrase }, "focusKeyphrase" );

	// Sync cornerstone store changes to hidden input with boolean to number selector.
	createDomSync( () => Number( selectors.selectIsCornerstone() ), { domGet: dom.getIsCornerstone, domSet: dom.setIsCornerstone }, "isCornerstone" );
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
