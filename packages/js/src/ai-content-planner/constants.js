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
	consent: "consent",
	contentSuggestions: "content-suggestions",
	contentOutline: "content-outline",
	replaceContent: "replace-content",
};

export const ERROR_DEFAULT = {
	errorCode: null,
	errorIdentifier: null,
	errorMessage: null,
};

/**
 * The category type for a content suggestion.
 * @typedef {Object} Category
 * @property {string} name The name of the category.
 * @property {number} id The ID of the category.
 */

/**
 * @typedef {Object} Suggestion
 * @property {string} intent The intent of the suggestion (e.g. "informational", "navigational", "commercial").
 * @property {string} title The title of the suggestion.
 * @property {string} explanation The explanation of the suggestion.
 * @property {string} keyphrase The keyphrase associated with the suggestion.
 * @property {string} meta_description The meta description associated with the suggestion.
 * @property {Category} category The category of the suggestion (optional).
 */
