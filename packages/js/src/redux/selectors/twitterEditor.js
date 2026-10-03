import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import { getDescription, getSeoTitle } from "./analysis";
import { getEditorDataExcerptWithFallback } from "./editorData";
import { getFacebookDescription, getFacebookTitle } from "./facebookEditor";
import {
	getReplacedExcerpt,
	getSeoDescriptionTemplate,
	getSeoTitleTemplate,
	getSeoTitleTemplateNoFallback,
	getSocialDescriptionTemplate,
	getSocialTitleTemplate,
} from "./fallbacks";

/**
 * Gets the twitter title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter title.
 */
export const getTwitterTitle = state => get( state, "twitterEditor.title", "" );

/**
 * Gets the twitter description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter description.
 */
export const getTwitterDescription = state => get( state, "twitterEditor.description", "" );

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image URL.
 */
export const getTwitterImageUrl = state => get( state, "twitterEditor.image.url", "" );

/**
 * Gets the twitter image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image type.
 */
export const getTwitterImageType = state => get( state, "settings.socialPreviews.twitterCardType", "summary" );

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getTwitterImageSrc = state => get( state, "twitterEditor.image.src", "" );

/**
 * Gets the Twitter alt text from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter alt text.
 */
export const getTwitterAltText = state => get( state, "twitterEditor.image.alt", "" );

/**
 * Gets the Twitter warnings from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter warnings.
 */
export const getTwitterWarnings = state => get( state, "twitterEditor.warnings", [] );

export const getTwitterTitleFallback = createSelector(
	[
		getSocialTitleTemplate,
		getFacebookTitle,
		getSeoTitle,
		getSeoTitleTemplateNoFallback,
		getSeoTitleTemplate,
	],
	( ...titles ) => titles.find( Boolean ) || ""
);
export const getTwitterTitleOrFallback = createSelector(
	[
		getTwitterTitle,
		getTwitterTitleFallback,
	],
	( title, fallback ) => title || fallback
);

export const getTwitterDescriptionFallback = createSelector(
	[
		getSocialDescriptionTemplate,
		getFacebookDescription,
		getDescription,
		getSeoDescriptionTemplate,
		getReplacedExcerpt,
		getEditorDataExcerptWithFallback,
	],
	( ...descriptions ) => descriptions.find( Boolean ) ?? ""
);
export const getTwitterDescriptionOrFallback = createSelector(
	[
		getTwitterDescription,
		getTwitterDescriptionFallback,
	],
	( description, fallback ) => description || fallback
);
