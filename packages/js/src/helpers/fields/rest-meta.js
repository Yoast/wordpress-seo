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
