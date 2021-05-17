/**
 * Checks if the block editor is loaded on the screen.
 *
 * @returns {boolean} True if the block editor is loaded.
 */
export default function isBlockEditor() {
	return window.wpseoScriptData && window.wpseoScriptData.isBlockEditor === "1";
}

