import { getValidContentTypes } from "@yoast/admin-ui-toolkit/helpers";
import { reduce } from "lodash";

/**
 * Gets the score for the score icon.
 *
 * @param {number|null} score The overall score of an analysis result.
 *
 * @returns {number} The score for the icon.
 */
export function getScoreForIcon( score ) {
	if ( score && score !== 0 ) {
		return score / 10;
	}
	return 0;
}

/**
 * @param {Object} contentTypes Object of content type options.
 * @returns {Object} Object of content type options merged with defauls.
 */
export const createContentTypesWithDefaults = ( contentTypes ) => reduce(
	getValidContentTypes( contentTypes ),
	( contentTypesWithDefaults, contentType, key ) => ( {
		...contentTypesWithDefaults,
		[ key ]: {
			filters: [],
			hasSchemaArticleTypes: false,
			hasSchemaPageTypes: false,
			hasAutomaticSchemaTypes: false,
			hasReadabilityAnalysis: true,
			hasSeoAnalysis: true,
			hasRelatedKeyphrases: true,
			hasCornerstone: true,
			hasContentEditor: true,
			hasMediaList: true,
			...contentType,
		},
	} ),
	{},
);
