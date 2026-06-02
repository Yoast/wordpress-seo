/**
 * Returns whether the block-editor REST meta path is active (metabox hidden fields disabled).
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true, the PHP metabox and its hidden
 * input fields are not rendered. All Fields helpers use this flag to decide whether to read
 * from / write to the DOM or to the `core/editor` store instead.
 *
 * @returns {boolean} True when the REST path is active.
 */
export default function isRestMetaActive() {
	return Boolean( window.wpseoScriptData?.disableMetaboxInBlockEditor );
}
