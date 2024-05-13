import { createSelector } from "@reduxjs/toolkit";
import { get } from "lodash";
import { getDescription, getSeoTitle } from "./analysis";
import { getEditorDataExcerptWithFallback } from "./editorData";
import {
	getReplacedExcerpt,
	getSeoDescriptionTemplate,
	getSeoTitleTemplate,
	getSeoTitleTemplateNoFallback,
	getSocialDescriptionTemplate,
	getSocialTitleTemplate,
} from "./fallbacks";

/**
 * Prepare twitter title to be saved in hidden field.
 * @param {string} value The value to be saved.
 * @returns {string} The value to be saved.
 */
export const getCustomSocialTitle = ( value ) => {
	if ( value.trim() === getSocialTitleTemplate().trim() ) {
		return "";
	}
	return value;
};

/**
 * Prepare twitter and facebook description to be saved in hidden field.
 * @param {string} value The value to be saved.
 * @returns {string} The value to be saved.
 */
export const getCustomSocialDescription = ( value ) => {
	if ( value.trim() === getSocialDescriptionTemplate().trim() ) {
		return "";
	}
	return value;
};

/**
 * Gets the facebook title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook title.
 */
export const getFacebookTitle = state => get( state, "facebookEditor.title", "" );

/**
 * Gets the facebook title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook title.
 */
export const getCustomFacebookTitle = state => {
	const title = getFacebookTitle( state );
	return getCustomSocialTitle( title );
};

/**
 * Gets the facebook description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook description.
 */
export const getFacebookDescription = state => get( state, "facebookEditor.description", "" );

/**
 * Gets the facebook description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook description.
 */
export const getCustomFacebookDescription = state => {
	const description = getFacebookDescription( state );
	return getCustomSocialDescription( description );
};


/**
 * Gets the facebook image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook image URL.
 */
export const getFacebookImageUrl = state => get( state, "facebookEditor.image.url" );

/**
 * Gets the facebook image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook image src.
 */
export const getFacebookImageSrc = state => get( state, "facebookEditor.image.src", "" );

/**
 * Gets the facebook image id from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {integer} Facebook image id.
 */
export const getFacebookImageId = state => get( state, "facebookEditor.image.id", "" );

/**
 * Gets the facebook alt text from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook alt text.
 */
export const getFacebookAltText = state => get( state, "facebookEditor.image.alt", "" );

/**
 * Gets the facebook warnings from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook warnings.
 */
export const getFacebookWarnings = state => get( state, "facebookEditor.warnings", [] );

export const getFacebookTitleFallback = createSelector(
	[
		getSocialTitleTemplate,
		getSeoTitle,
		getSeoTitleTemplateNoFallback,
		getSeoTitleTemplate,
	],
	( ...titles ) => titles.find( Boolean ) || ""
);
export const getFacebookTitleOrFallback = createSelector(
	[
		getFacebookTitle,
		getFacebookTitleFallback,
	],
	( title, fallback ) => title || fallback
);

export const getFacebookDescriptionFallback = createSelector(
	[
		getSocialDescriptionTemplate,
		getDescription,
		getSeoDescriptionTemplate,
		getReplacedExcerpt,
		getEditorDataExcerptWithFallback,
	],
	( ...descriptions ) => descriptions.find( Boolean ) ?? ""
);
export const getFacebookDescriptionOrFallback = createSelector(
	[
		getFacebookDescription,
		getFacebookDescriptionFallback,
	],
	( description, fallback ) => description || fallback
);
