/**
 * Checks whether AI Optimize button should be rendered.
 *
 * @param {boolean} hasAIFixes Whether the assessment has AI fixes.
 * @param {boolean} isElementor Whether the editor used is Elementor.
 * @param {boolean} isContentTypeSupported Whether the content type is supported by Yoast AI Optimize feature.
 * @returns {boolean} Whether AI Optimize button should be rendered.
 * */
export const shouldRenderAIOptimizeButton = ( hasAIFixes, isElementor, isContentTypeSupported ) => {
	const isElementorEditorPageActive = document.body.classList.contains( "elementor-editor-active" );
	// Check if the current editor is either Elementor or the Elementor in-between screen. In that case, don't show the button.
	const isNotElementorPage = ! isElementor && ! isElementorEditorPageActive;

	return hasAIFixes && isNotElementorPage && isContentTypeSupported;
};
