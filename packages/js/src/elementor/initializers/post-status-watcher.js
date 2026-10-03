/* global elementor */
import { debounce } from "lodash";
import { registerElementorUIHookAfter } from "../helpers/hooks";
import { isFormId } from "../helpers/is-form-id";

/**
 * Initializes the post status watcher.
 *
 * Using the "document/elements/settings" hook to listen for changes in the post status.
 * This is preferred over the "settings.page.model" change event, because that is lost when switching the document.
 *
 * @param {function} callback The callback to execute when the post status changes.
 * @param {number} [debounceDelay=500] The delay in milliseconds to debounce checking for potential changes.
 *
 * @returns {void}
 */
export const initializePostStatusWatcher = ( callback, debounceDelay = 500 ) => {
	/**
	 * Wraps the callback in a trailing debounce.
	 *
	 * We have our save AFTER Elementor's save.
	 * Therefore, the post status is changed before our SEO settings.
	 * Resulting in a flickering Warning after publishing.
	 * This trailing debounce prevents that.
	 */
	const debouncedCallback = debounce( callback, debounceDelay, { trailing: true } );

	registerElementorUIHookAfter(
		"document/elements/settings",
		"yoast-seo/document/post-status",
		( { settings } ) => debouncedCallback( settings.post_status ),
		( { container, settings } ) => {
			// The document ID needs to equal the Yoast form post ID.
			if ( ! isFormId( container?.document?.id || elementor.documents.getCurrent().id ) ) {
				return false;
			}

			// The post status needs to be present in the settings.
			return Boolean( settings?.post_status );
		}
	);
};
