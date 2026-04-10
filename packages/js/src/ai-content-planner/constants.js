/**
 * The store name for the content planner UI state.
 *
 * @type {string}
 */
export const FEATURE_MODAL_STORE = "yoast-seo/content-planner";

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
