/**
 * Helper class for Visual Composer.
 */
class VisualComposerHelper {
	/**
	 * Checks if Visual Composer is active.
	 *
	 * @returns {boolean} True if active.
	 */
	static isActive() {
		return !! window.VCV_I18N;
	}
}

export default VisualComposerHelper;
