/* global $e, elementor, YoastSEO */
import { dispatch } from "@wordpress/data";
import { addAction, doAction, removeAction } from "@wordpress/hooks";
import { debounce, throttle } from "lodash";
import { registerReactComponent } from "../../helpers/reactRoot";
import { registerElementorDataHookAfter, registerElementorUIHookAfter, registerElementorUIHookBefore } from "../helpers/hooks";
import { isFormId } from "../helpers/is-form-id";
import { isRelevantChange } from "../helpers/is-relevant-change";
import { updateSaveAsDraftWarning } from "../helpers/update-save-as-draft-warning";
import { initializeFormWatcher } from "./form-watcher";
import { initializePostStatusWatcher } from "./post-status-watcher";
import { renderYoastReactRoot } from "./render-sidebar";
import { initializeTab } from "./tab";

// Keep track of unsaved SEO setting changes.
let hasUnsavedSeoChanges = false;

/**
 * The save takes longer than the closing of the document, due to the async nature of the save.
 * This flag is used to prevent freezing the store before the save is done.
 */
let isSaving = false;

/**
 * Wraps the callback in a trailing debounce.
 *
 * We have our save AFTER Elementor's save.
 * Therefore, the post status is changed before our SEO settings.
 * Resulting in a flickering Warning after publishing.
 * This trailing debounce prevents that.
 */
const debouncedUpdateSaveAsDraftWarning = debounce( updateSaveAsDraftWarning, 500, { trailing: true } );

/**
 * Saves the form via AJAX action.
 *
 * @param {HTMLElement} form The form to submit.
 *
 * @returns {Promise<Object>} The promise that resolves with the response.
 */
const sendFormData = ( form ) => new Promise( ( resolve ) => {
	const formData = jQuery( form ).serializeArray().reduce( ( result, { name, value } ) => {
		result[ name ] = value;

		return result;
	}, {} );

	jQuery.post( form.getAttribute( "action" ), formData )
		.done( ( { success, data }, status, xhr ) => resolve( { success, formData, data, xhr } ) )
		.fail( ( xhr ) => resolve( { success: false, formData, xhr } ) );
} );

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @returns {void}
 */
export const initializeElementEditorIntegration = () => {
	const form = document.getElementById( "yoast-form" );
	if ( ! form ) {
		console.error( "Yoast form not found!" );
		return;
	}

	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;

	// The Yoast root should stay in the DOM, regardless of the tab being active.
	renderYoastReactRoot();
	// This also activates watchers to possibly re-register the tab.
	initializeTab();

	initializePostStatusWatcher( () => debouncedUpdateSaveAsDraftWarning( hasUnsavedSeoChanges ) );

	const formWatcher = initializeFormWatcher( form );
	formWatcher.subscribe( ( changes ) => {
		if ( ! changes.some( change => isRelevantChange( change.name, change.value, change.previousValue ) ) ) {
			return;
		}

		hasUnsavedSeoChanges = true;
		debouncedUpdateSaveAsDraftWarning( hasUnsavedSeoChanges );

		// Activates the Elementor save button.
		$e.internal( "document/save/set-is-modified", { status: true } );
	} );
	formWatcher.start();

	/**
	 * Handles what should happen when closing a document.
	 *
	 * @param {number} id The document ID.
	 * @param {string} [mode] The mode in which the document is closed.
	 *
	 * @returns {void}
	 */
	const handleCloseDocument = ( { mode } ) => {
		// Stop watching our Form immediately, as to not respond to possible discard changes.
		formWatcher.stop();

		// If the user is discarding the changes, restore the data snapshots.
		if ( mode === "discard" ) {
			YoastSEO.store._restoreSnapshot();
			formWatcher.restoreSnapshot();
			hasUnsavedSeoChanges = false;
			// Skip the debounce to include the change before the freeze.
			updateSaveAsDraftWarning( hasUnsavedSeoChanges );
		}

		/**
		 * Runs the final actions we want to do when the user closes a document.
		 *
		 * 1. Freeze the store.
		 * 2. Notify other plugins the document is no longer relevant.
		 * 3. Remove the action to prevent multiple calls.
		 *
		 * This function is called after the save is done. As to not freeze the store while saving!
		 *
		 * @returns {void}
		 */
		const finishClosingDocument = () => {
			// Disable our integration for the form document.
			YoastSEO.store._freeze( true );

			// Notify other plugins the document is no longer relevant.
			doAction( "yoast.elementor.toggleFreeze", { isFreeze: true, isDiscard: mode === "discard" } );

			removeAction( "yoast.elementor.save.success", "yoast/yoast-seo/finishClosingDocument" );
			removeAction( "yoast.elementor.save.failure", "yoast/yoast-seo/finishClosingDocument" );
		};

		if ( isSaving ) {
			addAction( "yoast.elementor.save.success", "yoast/yoast-seo/finishClosingDocument", finishClosingDocument );
			addAction( "yoast.elementor.save.failure", "yoast/yoast-seo/finishClosingDocument", finishClosingDocument );
			return;
		}
		finishClosingDocument();
	};

	/**
	 * Handles saving the document.
	 *
	 * @param {Object} document The Elementor document.
	 *
	 * @returns {Promise<void>} The promise that resolves when the save is done.
	 */
	const handleSaveDocument = async( { document } ) => {
		isSaving = true;

		/**
		 * Ensure we only save to the (HTML) form document.
		 *
		 * Elementor allows you to switch between documents.
		 * For now, only support saving the form document.
		 *
		 * Note: this is a safety check. The condition should have been checked by the hook itself.
		 */
		if ( ! isFormId( document.id ) ) {
			return;
		}

		/**
		 * Do not save our data to a revision.
		 *
		 * WordPress saves the metadata to the post parent, not the revision. See `update_post_meta`.
		 * Most likely this is because saving a revision on a published post will unpublish in WordPress itself.
		 * But Elementor does not unpublish your post when you save a draft.
		 * This would result in Yoast SEO data being live while saving a draft.
		 */
		if ( document.id !== elementor.config.document.revisions.current_id ) {
			return;
		}

		// Assume the save will be successful, to prevent a flashing warning due to the post status listener.
		hasUnsavedSeoChanges = false;

		const { success, formData, data, xhr } = await sendFormData( form );
		if ( ! success ) {
			// Revert false assumption, see above.
			hasUnsavedSeoChanges = true;
			isSaving = false;
			doAction( "yoast.elementor.save.failure" );
			return;
		}

		// Update the slug in our store if WP changed it.
		if ( data.slug && data.slug !== formData.slug ) {
			dispatch( "yoast-seo/editor" ).updateData( { slug: data.slug } );
		}
		// Update the saved slug.
		dispatch( "yoast-seo/editor" ).setEditorDataSlug( data.slug );

		// Update the save as draft warning. Note: skipping the debounce to include it in the snapshot.
		updateSaveAsDraftWarning( hasUnsavedSeoChanges );

		// Notify other plugins that the save was successful.
		doAction( "yoast.elementor.save.success", xhr );

		// Take a snapshot, to restore from here when discarding.
		YoastSEO.store._takeSnapshot();
		formWatcher.takeSnapshot();

		isSaving = false;
	};

	registerElementorUIHookBefore(
		"editor/documents/open",
		"yoast-seo/document/open",
		() => {
			// Enable our integration for the form document.
			YoastSEO.store._freeze( false );
			formWatcher.start();

			// Notify other plugins the document is relevant once more.
			doAction( "yoast.elementor.toggleFreeze", { isFreeze: false, isDiscard: false } );
		},
		( { id } ) => isFormId( id )
	);
	registerElementorUIHookAfter(
		"editor/documents/close",
		"yoast-seo/document/close",
		// Throttling to prevent multiple calls in a row to the handler, which does happen otherwise.
		throttle( handleCloseDocument, 500, { leading: true, trailing: false } ),
		( { id } ) => isFormId( id )
	);

	registerElementorDataHookAfter(
		"document/save/save",
		"yoast-seo/document/save",
		handleSaveDocument,
		( { document } ) => isFormId( document?.id || elementor.documents.getCurrent().id )
	);

	// Start of with a snapshot, for the discard functionality. Delay to give some time to our watchers and analysis.
	setTimeout( () => {
		YoastSEO.store._takeSnapshot();
		formWatcher.takeSnapshot();
	}, 2000 );
};
