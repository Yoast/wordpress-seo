import { get } from "lodash";
import getContentLocale from "../../analysis/getContentLocale";
import getL10nObject from "../../analysis/getL10nObject";
import {select} from "@wordpress/data";

/**
 * Gets the Estimated Reading Time from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The estimated reading time.
 */
export const getEstimatedReadingTime = state => get( state, "insights.estimatedReadingTime", 0 );

/**
 * Gets the flesch reading ease score from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {number|null} The flesch reading ease score.
 */
export const getFleschReadingEaseScore = state => get( state, "insights.fleschReadingEaseScore", null );

/**
 * Gets the flesch reading ease difficulty from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {DIFFICULTY|null} The flesch reading ease difficulty.
 */
export const getFleschReadingEaseDifficulty = state => get( state, "insights.fleschReadingEaseDifficulty", null );

/**
 * Checks if the flesch reading ease score and difficulty are available.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether the flesch reading ease score and difficulty are available.
 */
export const isFleschReadingEaseAvailable = state => {
	return getFleschReadingEaseScore( state ) !== null && getFleschReadingEaseDifficulty( state ) !== null;
};

/**
 * Gets the length of the text, either based on the number of words or the number of characters in the text.
 *
 * @param {Object} state The state.
 *
 * @returns {{ count: number, unit: ("character"|"word") }} The text length.
 */
export const getTextLength = state => get( state, "insights.textLength", {} );

/**
 * Checks whether the formality feature, or an upsell for the feature, should be shown.
 * It should not be shown if formality is not supported in the current locale.
 * If the language is supported, an upsell should be shown in Free.
 * In Premium, the feature should be shown if the version of Premium contains the getTextFormalityLevel selector.
 *
 * @returns {boolean}
 */
export const isFormalitySupported = () => {
	const isLanguageSupported = getContentLocale().split( "_" )[ 0 ] === "en";
	const isPremium = getL10nObject().isPremium;

	if( ! isLanguageSupported ) {
		return false;
	}

	// The formality feature is not available in Free, but we do want to show an upsell for it.
	if ( ! isPremium ) {
		return true;
	}

	/*
	 * The formality feature is only available if the getTextFormalityLevel selector is available
	 * (so not in the versions of Premium before it was added).
	*/
	const premiumSelectors = window.wp.data.select( "yoast-seo-premium/editor" );
	return premiumSelectors.hasOwnProperty("getTextFormalityLevel" );
}
