import { get } from "lodash";
import { dispatch, select } from "@wordpress/data";

/**
 * Returns whether the block-editor REST meta path is active (metabox hidden fields disabled).
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true, the PHP metabox and its hidden
 * input fields are not rendered. All Fields helpers use this flag to decide whether to read
 * from / write to the DOM or to the `core/editor` store instead.
 */
export const isRestMetaActive = Boolean( get( window, "wpseoScriptData.disableMetaboxInBlockEditor", false ) );

/**
 * Returns whether a meta write to core/editor should be skipped.
 *
 * Returns true in two cases:
 * 1. The entity meta hasn't loaded yet (getEditedPostAttribute("meta") is null).
 *    Writing before the entity loads would dispatch editPost with an incorrect value,
 *    which then overrides the actual saved value once the entity finishes loading.
 * 2. The new value already matches the current edited value.
 *    Skipping no-op dispatches avoids marking the post dirty unnecessarily.
 *
 * @param {string} metaKey  The meta key to check.
 * @param {string} newValue The value about to be written.
 *
 * @returns {boolean} True when the write should be skipped.
 */
export const shouldSkipMetaWrite = ( metaKey, newValue ) => {
	const currentMeta = select( "core/editor" ).getEditedPostAttribute( "meta" );
	return ! currentMeta || currentMeta[ metaKey ] === String( newValue );
};

/**
 * Writes one or more meta values to the core/editor store without adding an undo entry.
 *
 * Use this for computed/derived values (e.g. analysis scores, estimated reading time) that
 * should be persisted on save but must not pollute the block-editor undo stack.
 *
 * @param {Object} meta A plain object mapping meta keys to their new values.
 *
 * @returns {void}
 */
export const writeMetaWithoutUndo = ( meta ) => {
	const postType = select( "core/editor" ).getCurrentPostType();
	const postId = select( "core/editor" ).getCurrentPostId();
	dispatch( "core" ).editEntityRecord( "postType", postType, postId, { meta }, { undoIgnore: true } );
};

/**
 * Reads a single meta value from the core/editor store.
 *
 * @param {string} metaKey  The meta key.
 * @param {string} fallback Returned when the key is absent or null. Defaults to "".
 *
 * @returns {string} The meta value, or fallback.
 */
const readMeta = ( metaKey, fallback = "" ) =>
	select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKey ] ?? fallback;

/**
 * Get value from the DOM when REST meta is inactive, or from the core/editor store when active.
 *
 * @param {string} metaKey The meta key.
 * @param {HTMLElement} element The DOM element to read from when REST meta is inactive.
 * @param {string} fallback Returned when the key is absent or null. Defaults to "".
 *
 * @returns {string} The meta value, or fallback.
 */
export const getMetaValue = ( metaKey, element, fallback = "" ) => {
	if ( isRestMetaActive ) {
		return readMeta( metaKey, fallback );
	}
	return element?.value ?? fallback;
};

/**
 * Writes a single meta value to the core/editor store.
 *
 * Always coerces value to a string — all Yoast meta fields are registered with type:string
 * and the REST API rejects non-string values with a 400 error.
 *
 * @param {string} metaKey The meta key.
 * @param {*}      value   The value to write. Coerced to string before dispatch.
 *
 * @returns {void}
 */
const writeMeta = ( metaKey, value ) => {
	const stringValue = String( value );
	if ( ! shouldSkipMetaWrite( metaKey, stringValue ) ) {
		dispatch( "core/editor" ).editPost( { meta: { [ metaKey ]: stringValue } } );
	}
};

/**
 * Sets Meta value on the DOM when REST meta is inactive, or dispatches to core/editor when active.
 *
 * @param {string} metaKey The meta key.
 * @param {HTMLElement} element The DOM element to write to when REST meta is inactive.
 * @param {string} value The value to write.
 * @param {boolean} withoutUndo When true, the write bypasses the undo stack. Defaults to false.
 *
 * @returns {void}
 */
export const setMetaValue = ( metaKey, element, value, withoutUndo = false ) => {
	if ( isRestMetaActive ) {
		if ( withoutUndo ) {
			writeMetaWithoutUndo( { [ metaKey ]: value } );
		} else {
			writeMeta( metaKey, value );
		}
		return;
	}
	if ( element ) {
		element.value = value;
	}
};
