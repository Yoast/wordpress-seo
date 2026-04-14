/**
 * The store name for the content planner feature.
 *
 * @type {string}
 */
export const CONTENT_PLANNER_STORE = "yoast-seo/content-planner";

/**
 * Maps editor store values to API-expected editor type strings.
 *
 * @type {Object<string, string>}
 */
export const EDITOR_TYPE_TO_API_VALUE = {
	blockEditor: "gutenberg",
	elementorEditor: "elementor",
	classicEditor: "classic",
};

/**
 * The possible statuses for the FeatureModal flow.
 *
 * @type {Object<string, string>}
 */
export const FEATURE_MODAL_STATUS = {
	idle: "idle",
	contentSuggestionsLoading: "content-suggestions-loading",
	contentSuggestionsSuccess: "content-suggestions-success",
	contentOutline: "content-outline",
	replaceContent: "replace-content",
};
