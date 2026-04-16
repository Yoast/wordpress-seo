/**
 * The store name for the content planner feature.
 *
 * @type {string}
 */
export const CONTENT_PLANNER_STORE = "yoast-seo/content-planner";

/**
 * The possible statuses for the FeatureModal flow.
 *
 * @type {Object<string, string>}
 */
export const FEATURE_MODAL_STATUS = {
	idle: "idle",
	contentSuggestions: "content-suggestions",
	contentSuggestionsError: "content-suggestions-error",
	contentOutline: "content-outline",
	contentOutlineError: "content-outline-error",
	replaceContent: "replace-content",
};
