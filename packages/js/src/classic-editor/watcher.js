/* eslint-disable require-jsdoc */
import { get } from "lodash";
import { subscribe, dispatch, select } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-integration";
import * as dom from "./dom";
import { addEventHandler as addTinyMceEventHandlers } from "../lib/tinymce";

const watchDomChanges = () => {
	const actions = dispatch( SEO_STORE_NAME );
	const createHandleValueChange = ( action ) => ( event ) => action( get( event, "target.value", "" ) );
	const createStoreSync = ( domId, action ) => document.getElementById( domId )?.on( "change", createHandleValueChange( action ) );

	createStoreSync( DOM_IDS.TITLE, actions.updateTitle );
	createStoreSync( DOM_IDS.EXCERPT, actions.updateExcerpt );
	createStoreSync( DOM_IDS.PERMALINK, actions.updatePermalink );
	createStoreSync( DOM_IDS.DATE, actions.updateData );

	// Special sync for content TinyMCE editor.
	addTinyMceEventHandlers( DOM_IDS.CONTENT, [ "input", "change", "cut", "paste" ], createHandleValueChange( actions.updateContent ) );
};

const watchStoreChanges = () => {
	const selectors = select( SEO_STORE_NAME );
	const createDomSync = ( { domGet, domSet }, selector ) => subscribe( () => {
		const domValue = "";
		const storeValue = "";

		if ( domValue !== storeValue ) {
			setSeoTitle();
		}
	} );
};

// Watch and syncs editor data changes
const createClassicEditorWatcher = () => {
	return {
		watch: () => {
			watchDomChanges();
			watchStoreChanges();
		},
	};
};

export default createClassicEditorWatcher;
