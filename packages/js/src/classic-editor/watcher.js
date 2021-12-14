/* eslint-disable no-unused-expressions */
import { get, set, debounce, forEach, isEqual, reduce } from "lodash";
import { subscribe, dispatch, select } from "@wordpress/data";
import { SEO_STORE_NAME, FOCUS_KEYPHRASE_ID } from "@yoast/seo-integration";
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
	const createHandleValueChange = ( action ) => debounce( ( event ) => action( get( event, "target.value", "" ) ), SYNC_DEBOUNCE_MS );

	// Sync simple editor changes to store.
	document.getElementById( DOM_IDS.TITLE )?.addEventListener( "input", createHandleValueChange( actions.updateTitle ) );
	document.getElementById( DOM_IDS.EXCERPT )?.addEventListener( "input", createHandleValueChange( actions.updateExcerpt ) );

	// Sync featured image to store, note the structuring.
	document.getElementById( DOM_IDS.FEATURED_IMAGE_ID )?.addEventListener( "change", ( event ) => (
		actions.updateFeaturedImage( {
			id: get( event, "target.value", "" ),
			url: dom.getFeaturedImageUrl(),
		} )
	) );

	// Sync multiple slug fields changes to store.
	forEach(
		[ DOM_IDS.SLUG, DOM_IDS.SLUG_NEW_POST, DOM_IDS.SLUG_EDIT_POST ],
		( domId ) => document.getElementById( domId )?.addEventListener( "change", createHandleValueChange( actions.updateSlug ) )
	);

	// Sync multiple date fields changes to store.
	forEach(
		[ DOM_IDS.DATE_MONTH, DOM_IDS.DATE_DAY, DOM_IDS.DATE_YEAR ],
		( domId ) => document.getElementById( domId )?.addEventListener( "change", () => (
			// Format date according to standards using WP date API.
			actions.updateDate( window?.wp?.date?.dateI18n( "M j, Y", dom.getDate() ) ) )
		)
	);

	// Sync TinyMCE editor changes to store.
	addTinyMceEventHandlers( DOM_IDS.CONTENT, [ "input", "change", "cut", "paste" ], createHandleValueChange( actions.updateContent ) );
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
	 * Creates a debounced DOM sync function that subscribes to store changes and maybe updates a DOM element.
	 *
	 * @param {Function} selector Store selector.
	 * @param {Function} domSet DOM element value setter.
	 * @param {string} [cacheKey] Optional key to use in the cache.
	 * @returns {Function} Unsubscribe function.
	 */
	const createDomSync = ( selector, domSet, cacheKey = "" ) => subscribe( debounce( () => {
		const cacheValue = get( cache, cacheKey );
		const storeValue = selector();
		if ( ! isEqual( cacheValue, storeValue ) ) {
			// Update DOM if store value changed.
			domSet( storeValue );
			// Update cache if cache key exists.
			cache = cacheKey ? set( cache, cacheKey, storeValue ) : cache;
		}
	}, SYNC_DEBOUNCE_MS ) );

	// Sync simple store changes to hidden inputs.
	createDomSync( selectors.selectSeoTitle, dom.setSeoTitle, "seoTitle" );
	createDomSync( selectors.selectMetaDescription, dom.setMetaDescription, "metaDescription" );
	createDomSync( selectors.selectKeyphrase, dom.setFocusKeyphrase, "focusKeyphrase" );
	createDomSync( selectors.selectSynonyms, dom.setSynonyms, "synonyms" );

	/**
	 * Select related keyphrase entries and transform to same structure as present in hidden input for eqaulity check.
	 * Kind of a heavy function, might need some memoizing in the future.
	 *
	 * @returns {{ keyword: string, score: number }[]} Array of related keyphrase entries.
	 */
	const selectRelatedKeyphraseEntries = () => reduce(
		selectors.selectKeyphraseEntries(),
		( acc, { keyphrase, id } ) => isEqual( id, FOCUS_KEYPHRASE_ID ) ? acc : [
			...acc,
			{ keyword: keyphrase, score: selectors.selectSeoScore( id ) },
		],
		[]
	);

	// Sync related keyphrase changes to hidden input.
	createDomSync( selectRelatedKeyphraseEntries, dom.setRelatedKeyphraseEntries, "relatedKeyphraseEntries" );
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
