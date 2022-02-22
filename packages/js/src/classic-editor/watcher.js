import { dispatch, select, subscribe } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-integration";
import { debounce, forEach, get, isEqual, isFunction, set } from "lodash";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import { addEventHandler as addTinyMceEventListener, getContentTinyMce } from "../lib/tinymce";
import { update as updateAdminBar } from "../ui/adminBar";
import * as publishBox from "../ui/publishBox";
import { update as updateTrafficLight } from "../ui/trafficLight";
import * as dom from "./helpers/dom";
import { getPostCategories, getPostCategoryCheckboxes, getPostMostUsedCategoryCheckboxes, getPostTags, getTagsList } from "./helpers/dom";

const SYNC_DEBOUNCE_TIME = 500;
const { DOM_IDS, DOM_CLASSES, DOM_QUERIES } = dom;

/**
 * Creates a debounced function that handles value change events on DOM elements.
 *
 * @param {Function} action Store action to dispatch.
 * @returns {Function} Value change event handler.
 */
const createHandleValueChange = ( action ) => debounce( ( event ) => action( get( event, "target.value", "" ) ), SYNC_DEBOUNCE_TIME );

/**
 * Creates a store sync that subscribes to DOM changes and maybe dispatches a store action.
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

/**
 * Creates a debounced function that handles value change events on Tiny MCE editors.
 *
 * @param {string} domId Id of DOM element.
 * @param {Function} action Store action.
 * @returns {Function} Value change event handler.
 */
const createTinyMceContentSync = ( domId, action ) => {
	const tinyMceEventNames = [ "input", "change", "cut", "paste" ];
	const editor = window?.tinymce?.editors?.[ domId ];
	const handleEvent = debounce( () => action( getContentTinyMce( domId ) ), SYNC_DEBOUNCE_TIME );
	if ( editor ) {
		// If editor already initialized, go ahead and listen for events.
		return forEach( tinyMceEventNames, ( eventName ) => editor?.on( eventName, handleEvent ) );
	}
	// Fallback to adding event listeners when editor with id is initialized.
	addTinyMceEventListener( domId, tinyMceEventNames, handleEvent );
};

// Store cache for performance.
let storeCache = {};

/**
 * Creates a debounced DOM sync that subscribes to store changes and maybe updates a DOM element.
 *
 * @param {Function} selector Store selector to listen to.
 * @param {{ domGet: Function, domSet: Function }} domLens Lens for getting and setting DOM element values.
 * @param {string} [storeCacheKey] Optional key to use in the cache.
 * @returns {Function} Unsubscribe from store function.
 */
const createDomSync = ( selector, { domGet, domSet }, storeCacheKey = "" ) => subscribe( debounce( () => {
	const cacheValue = get( storeCache, storeCacheKey );
	const storeValue = selector();

	if ( isEqual( cacheValue, storeValue ) ) {
		// No store change.
		return false;
	}
	if ( isEqual( domGet(), storeValue ) ) {
		// Store change is already in DOM.
		return false;
	}
	if ( storeCacheKey ) {
		// Update cache if cache key exists.
		storeCache = set( storeCache, storeCacheKey, storeValue );
	}
	// Update DOM if store value changed.
	domSet( storeValue );
}, SYNC_DEBOUNCE_TIME ) );

/**
 * Create an SEO score updating function for DOM and legacy UI.
 *
 * @param {Function} selectIsActive Selector that checks if analysis is active.
 * @param {Function} domSet Function that sets DOM elements prop.
 * @returns {Function} Function that updates DOM and legacy UI with SEO score.
 */
const createUpdateSeoScore = ( selectIsActive, domSet ) => ( score ) => {
	if ( ! selectIsActive() ) {
		return;
	}
	// Update DOM.
	domSet( score );
	// Also update legacy UI.
	const indicator = getIndicatorForScore( score );
	updateTrafficLight( indicator );
	updateAdminBar( indicator );
	publishBox.updateScore( "keyword", indicator.className );
};

/**
 * Create a readability score updating function for DOM and legacy UI.
 *
 * @param {Function} selectIsActive Selector that checks if analysis is active.
 * @param {Function} domSet Function that sets DOM elements prop.
 * @returns {Function} Function that updates DOM and legacy UI with SEO score.
 */
const createUpdateReadabilityScore = ( selectIsActive, domSet ) => ( score ) => {
	if ( ! selectIsActive() ) {
		return;
	}
	// Update DOM.
	domSet( score );
	// Also update legacy UI.
	const indicator = getIndicatorForScore( score );
	updateAdminBar( indicator );
	publishBox.updateScore( "content", indicator.className );
};

/**
 * Watches the category checkboxes in the classic editor
 * for changes and updates the categories in the store accordingly.
 *
 * @param {function} updateTerms A callback function to update the categories in the store.
 *
 * @returns {void}
 */
const createCategoriesSync = ( updateTerms ) => {
	/**
	 * Retrieves the categories from the DOM and syncs them to the SEO store.
	 *
	 * @returns {void}
	 */
	const syncCategories = () => {
		updateTerms( { taxonomyType: "categories", terms: getPostCategories() } );
	};

	/**
	 * Watches the category checkboxes for changes,
	 * and updates the categories in the SEO store accordingly.
	 *
	 * @returns {void}
	 */
	const watchCategoryCheckboxes = () => {
		// Sync the categories whenever there are changes in the checkboxes.
		// Watch both the "All Categories" and "Most Used" sections.
		const checkboxes = [ ...getPostCategoryCheckboxes(), ...getPostMostUsedCategoryCheckboxes() ];
		checkboxes.forEach(
			checkbox => {
				checkbox.removeEventListener( "input", syncCategories );
				checkbox.addEventListener( "input", syncCategories );
			}
		);
	};

	const categoryChecklist = document.getElementById( "categorychecklist" );
	if ( categoryChecklist ) {
		// Observe the category checklist for changes and update the categories if new categories are added.
		// Consider only the "All Categories" section, because newly added categories will not end up in the "Most Used" section.
		const observer = new MutationObserver( () => {
			updateTerms( { taxonomyType: "categories", terms: getPostCategories() } );
			watchCategoryCheckboxes();
		} );
		observer.observe( categoryChecklist, { childList: true, subtree: true } );
	}

	watchCategoryCheckboxes();
};

/**
 * Watches the tags list in the classic editor for changes and updates the tags in the store accordingly.
 *
 * @param updateTerms 	A callback function to update the tags in the store.
 *
 * @returns {void}
 */
const createTagsSync = ( updateTerms ) => {
	let previousLength = 0;

	/**
	 * Retrieves the tags from the DOM and syncs them to the SEO store.
	 *
	 * @returns {void}
	 */
	const syncTags = () => {
		updateTerms( { taxonomyType: "tags", terms: getPostTags() } );
	};

	/**
	 * Watches the tags list for changes, and updates the tags in the SEO store accordingly.
	 *
	 * @returns {void}
	 */
	const watchTagsList = () => {
		const tagsList = getTagsList();
		let currentLength = tagsList.length;
		if ( currentLength !== previousLength ) {
			syncTags();
			previousLength = currentLength;
		}
	};

	// Retrieve the Tags element.
	const tagsElement = document.querySelector( ".tagchecklist" );
	if ( tagsElement ) {
		// Observe the tags list for changes and update the tags if (new) tags are added or removed.
		const observer = new MutationObserver( () => {
			updateTerms( { taxonomyType: "tags", terms: getPostTags() } );
			watchTagsList();
		} );
		observer.observe( tagsElement, { childList: true, subtree: true } );
	}
};

/**
 * Watches and syncs post DOM changes to the store.
 *
 * @returns {void}
 */
const syncPostToStore = () => {
	const actions = dispatch( SEO_STORE_NAME );
	// Sync simple editor changes to the store.
	createStoreSync( DOM_IDS.POST_TITLE, actions.updateTitle, "input" );
	createStoreSync( DOM_IDS.POST_EXCERPT, actions.updateExcerpt, "input" );

	/**
	 * Handles attaching listeners to post slug editing.
	 *
	 * @returns {void}
	 */
	const createSlugSync = () => {
		/*
		 * Listen to the parent div because otherwise we need to rebind more:
		 * The save button is only there in edit mode, but even the button container seems to be removed and re-added.
		 */
		// eslint-disable-next-line no-unused-expressions
		document.getElementById( DOM_IDS.POST_SLUG_EDIT_PARENT )?.addEventListener( "click", ( event ) => {
			if ( event.target.classList.contains( DOM_CLASSES.POST_SLUG_SAVE_BUTTON ) ) {
				const slug = dom.getPostNewSlug();
				if ( slug ) {
					actions.updateSlug( slug );
					actions.updatePermalink( get( window, "wpseoScriptData.metabox.base_url", "" ) + slug );
				}
			}
		} );
	};
	// Sync post slug changes to the store.
	createSlugSync();

	/**
	 * Handles attaching listeners to saving the date (published or publish on).
	 *
	 * @returns {void}
	 */
	const createDateSync = () => {
		// eslint-disable-next-line no-unused-expressions
		document.querySelector( DOM_QUERIES.POST_DATE_SAVE_BUTTON )?.addEventListener( "click", () => {
			actions.updateDate( dom.getPostDate() );
		} );
	};
	// Sync date changes to the store.
	createDateSync();

	/**
	 * Handles attaching listeners to the set and remove of the featured image.
	 *
	 * @returns {void}
	 */
	const createFeaturedImageSync = () => {
		// Safety check.
		if ( ! isFunction( window.wp?.media?.featuredImage?.frame ) ) {
			return;
		}

		const frame = window.wp.media.featuredImage.frame();

		// Change the featured image when one is selected in the editor.
		frame.on( "select", () => {
			// Get the image from the featured image API here, the HTML is not yet there.
			const image = frame.state().get( "selection" ).first();

			actions.updateFeaturedImage( {
				id: image.get( "id" ),
				url: image.get( "url" ),
				width: image.get( "width" ),
				height: image.get( "height" ),
				alt: image.get( "alt" ),
			} );
		} );

		// Remove the featured image when it is removed in the editor. Listen to a parent that always exists.
		// eslint-disable-next-line no-unused-expressions
		document.getElementById( DOM_IDS.POST_FEATURED_IMAGE_PARENT )?.addEventListener(
			"click",
			( event ) => {
				if ( event.target.id === DOM_IDS.POST_FEATURED_IMAGE_REMOVE ) {
					actions.updateFeaturedImage( {} );
				}
			}
		);
	};
	// Sync post featured image fields changes to the store.
	createFeaturedImageSync();

	// Sync TinyMCE editor changes to the store.
	createTinyMceContentSync( DOM_IDS.POST_CONTENT, actions.updateContent );
	// Sync editor changes to the store when in text mode.
	createStoreSync( DOM_IDS.POST_CONTENT, actions.updateContent, "input" );
	createCategoriesSync( actions.updateTerms );
	createTagsSync( actions.updateTerms );
};

/**
 * Watches and syncs store changes to the post DOM.
 *
 * @returns {void}
 */
const syncStoreToPost = () => {
	const selectors = select( SEO_STORE_NAME );
	// Sync simple store changes to hidden inputs.
	createDomSync( selectors.selectSeoTitle, { domGet: dom.getPostSeoTitle, domSet: dom.setPostSeoTitle }, "seoTitle" );
	createDomSync( selectors.selectMetaDescription, { domGet: dom.getPostMetaDescription, domSet: dom.setPostMetaDescription }, "metaDescription" );
	createDomSync( selectors.selectKeyphrase, { domGet: dom.getPostFocusKeyphrase, domSet: dom.setPostFocusKeyphrase }, "focusKeyphrase" );
	createDomSync( selectors.selectIsCornerstone, { domGet: dom.getPostIsCornerstone, domSet: dom.setPostIsCornerstone }, "isCornerstone" );
	createDomSync(
		selectors.selectSeoScore,
		{
			domGet: dom.getPostSeoScore,
			domSet: createUpdateSeoScore( selectors.selectIsSeoAnalysisActive, dom.setPostSeoScore ),
		},
		"seoScore"
	);
	createDomSync(
		selectors.selectReadabilityScore,
		{
			domGet: dom.getPostReadabilityScore,
			domSet: createUpdateReadabilityScore( selectors.selectIsReadabilityAnalysisActive, dom.setPostReadabilityScore ),
		},
		"readabilityScore"
	);
};

/**
 * Watches and syncs term DOM changes to the store.
 *
 * @returns {void}
 */
const syncTermToStore = () => {
	const actions = dispatch( SEO_STORE_NAME );
	// Sync term field changes to the store.
	createStoreSync( DOM_IDS.TERM_NAME, actions.updateTitle, "input" );
	createStoreSync(
		DOM_IDS.TERM_SLUG,
		( slug ) => {
			actions.updateSlug( slug );
			actions.updatePermalink( get( window, "wpseoScriptData.metabox.base_url", "" ) + slug );
		},
		"input"
	);

	// Sync TinyMCE editor changes to the store.
	createTinyMceContentSync( DOM_IDS.TERM_DESCRIPTION, actions.updateContent );
	// Sync editor changes to the store when in text mode.
	createStoreSync( DOM_IDS.TERM_DESCRIPTION, actions.updateContent, "input" );
};

/**
 * Watches and syncs store changes to the term DOM.
 *
 * @returns {void}
 */
const syncStoreToTerm = () => {
	const selectors = select( SEO_STORE_NAME );
	// Sync simple store changes to hidden inputs.
	createDomSync( selectors.selectSeoTitle, { domGet: dom.getTermSeoTitle, domSet: dom.setTermSeoTitle }, "seoTitle" );
	createDomSync( selectors.selectMetaDescription, { domGet: dom.getTermMetaDescription, domSet: dom.setTermMetaDescription }, "metaDescription" );
	createDomSync( selectors.selectKeyphrase, { domGet: dom.getTermFocusKeyphrase, domSet: dom.setTermFocusKeyphrase }, "focusKeyphrase" );
	createDomSync( selectors.selectIsCornerstone, { domGet: dom.getTermIsCornerstone, domSet: dom.setTermIsCornerstone }, "isCornerstone" );
	createDomSync(
		selectors.selectSeoScore,
		{
			domGet: dom.getTermSeoScore,
			domSet: createUpdateSeoScore( selectors.selectIsSeoAnalysisActive, dom.setTermSeoScore ),
		},
		"seoScore"
	);
	createDomSync(
		selectors.selectReadabilityScore,
		{
			domGet: dom.getTermReadabilityScore,
			domSet: createUpdateReadabilityScore( selectors.selectIsReadabilityAnalysisActive, dom.setTermReadabilityScore ),
		},
		"readabilityScore"
	);
};

/**
 * Watches post changes.
 *
 * @returns {void}
 */
export const initPostWatcher = () => {
	syncPostToStore();
	syncStoreToPost();
};

/**
 * Watches term changes.
 *
 * @returns {void}
 */
export const initTermWatcher = () => {
	syncTermToStore();
	syncStoreToTerm();
};
