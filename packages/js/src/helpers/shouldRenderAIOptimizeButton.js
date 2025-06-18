import { select } from "@wordpress/data";

/**
 * Checks whether AI Optimize button should be rendered.
 *
 * @param {boolean} hasAIFixes Whether the assessment has AI fixes.
 * @param {boolean} isElementor Whether the editor used is Elementor.
 * @param {boolean} isTerm Whether the current page is a term page.
 * @returns {boolean} Whether AI Optimize button should be rendered.
 * */
export const shouldRenderAIOptimizeButton = ( hasAIFixes, isElementor, isTerm ) => {
	const isElementorEditorPageActive = document.body.classList.contains( "elementor-editor-active" );
	// Check if the current editor is either Elementor or the Elementor in-between screen. In that case, don't show the button.
	const isNotElementorPage = ! isElementor && ! isElementorEditorPageActive;
	const isClassic = select( "yoast-seo/editor" ).getEditorType() === "classicEditor";
	return hasAIFixes && isNotElementorPage && ! isTerm && ! isClassic;
};
