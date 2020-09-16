/**
 * Checks if the elementor editor is loaded on the screen.
 *
 * @returns {boolean} True if the elementor editor is loaded.
 */
export default function isElementorEditor() {
	return window.wpseoScriptData && window.wpseoScriptData.isElementorEditor === "1";
}
