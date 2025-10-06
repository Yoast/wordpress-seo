import { preparePromptContent } from "../helpers";
import { dispatch, select as wpSelect, subscribe } from "@wordpress/data";
import { debounce } from "lodash";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";
import createWatcher from "../../helpers/create-watcher";

/**
 * Creates an updater function: updates the prompt content, which we call on load and whenever the editor content changes.
 * @returns {function} The updater function.
 */
const updatePromptContent = () => {
	const { setPromptContent } = dispatch( STORE_NAME_AI );
	return () => {
		preparePromptContent( setPromptContent );
	};
};

/**
 * Creates a subscriber function: a watcher on getEditorDataContent from the yoast-seo/editor store.
 * @returns {function} The watcher function.
 */
const createSubscriber = () => {
	const { getEditorDataContent } = wpSelect( STORE_NAME_EDITOR );
	const updater = updatePromptContent();

	// Force an initial update after 1.5 seconds.
	setTimeout( updater, 1500 );

	return createWatcher( getEditorDataContent, updater );
};

/**
 * Initializes the prompt content: set the initial prompt content on load and subscribes to updates to the editor content.
 * @returns {void}
 */
export const initializePromptContent = () => {
	// Run the updater on load.
	updatePromptContent();

	// Subscribe to changes to the editor content afterward.
	// Here, we delay execution by 1.5 seconds for any change, and force execution after 3 seconds.
	// We do this similarly when fetching the results for the insights tab.
	subscribe( debounce( createSubscriber(), 1500, { maxWait: 3000 } ) );
};
