import { __ } from "@wordpress/i18n";
import { replacementVariableConfigurations } from "@yoast/seo-integration";
import { get, includes, map } from "lodash";
import { termTitle } from "./configurations";
import * as configurations from "./configurations";

/**
 * Sets `isRecommended` for each entry in the list, based on the `name` property.
 *
 * @param {Object[]} list The list.
 * @param {string[]} recommended The recommended names.
 *
 * @returns {Object[]} The list with `isRecommended` based on a global list.
 */
const setIsRecommended = ( list, recommended = [] ) => map( list, config => ( {
	...config,
	isRecommended: includes( recommended, config.name ),
} ) );

/**
 * Creates the replacement variable configurations list for posts.
 *
 * @see [Overview of available variables]{@link https://yoast.com/help/list-available-snippet-variables-yoast-seo/}
 *
 * @returns {ReplacementVariableConfiguration[]} The replacement variable configurations for posts.
 */
export const createPostReplacementVariableConfigurations = () => setIsRecommended( [
	// Basic variables.
	replacementVariableConfigurations.date,
	replacementVariableConfigurations.excerpt,
	replacementVariableConfigurations.excerptOnly,
	replacementVariableConfigurations.title,
	configurations.category,
	configurations.parentTitle,
	configurations.primaryCategory,
	configurations.searchPhrase,
	configurations.separator,
	configurations.siteName,
	configurations.siteDescription,
	configurations.tag,

	// Advanced variables.
	replacementVariableConfigurations.focusKeyphrase,
	configurations.id,
	configurations.userName,
	configurations.page,
	...configurations.customFields,
	...configurations.customTaxonomies,
	...configurations.customTaxonomyDescriptions,

	// Deprecated variables.
	{ ...configurations.currentDate, isVisible: false },
	{ ...configurations.currentDay, isVisible: false },
	{ ...configurations.currentMonth, isVisible: false },
	{ ...configurations.currentYear, isVisible: false },

	// AIOSEO imported variables.
	{ ...configurations.authorFirstname, isVisible: false },
	{ ...configurations.authorLastname, isVisible: false },
	{ ...configurations.categoryTitle, isVisible: false },
	{ ...replacementVariableConfigurations.permalink, isVisible: false },
	{
		name: "post_content",
		getLabel: () => __( "Post content", "wordpress-seo" ),
		getReplacement: replacementVariableConfigurations.content.getReplacement,
		isVisible: false,
	},
	{ ...configurations.postDay, isVisible: false },
	{ ...configurations.postMonth, isVisible: false },
	{ ...configurations.postYear, isVisible: false },

	// Keep non-applicable variables.
	{ ...configurations.categoryDescription, getReplacement: () => "" },
	{ ...configurations.tagDescription, getReplacement: () => "" },
	{ ...configurations.termDescription, getReplacement: () => "" },
], get( window, "wpseoScriptData.analysis.plugins.replaceVars.recommended_replace_vars", [] ) );

/**
 * Creates the replacement variable configurations list for terms.
 *
 * @see [Overview of available variables]{@link https://yoast.com/help/list-available-snippet-variables-yoast-seo/}
 *
 * @returns {ReplacementVariableConfiguration[]} The replacement variable configurations for terms.
 */
export const createTermReplacementVariableConfigurations = () => setIsRecommended( [
	// Basic variables.
	replacementVariableConfigurations.date,
	replacementVariableConfigurations.excerpt,
	replacementVariableConfigurations.excerptOnly,
	replacementVariableConfigurations.termTitle,
	configurations.categoryDescription,
	configurations.parentTitle,
	configurations.siteName,
	configurations.siteDescription,
	configurations.searchPhrase,
	configurations.separator,
	configurations.tagDescription,
	configurations.termDescription,
	configurations.termHierarchy,
	configurations.termTitle,

	// Advanced variables.
	replacementVariableConfigurations.focusKeyphrase,
	configurations.id,
	configurations.page,

	// Deprecated variables.
	configurations.currentYear,

	// Keep non-applicable variables.
	replacementVariableConfigurations.title,
	configurations.category,
	configurations.primaryCategory,
], get( window, "wpseoScriptData.analysis.plugins.replaceVars.recommended_replace_vars", [] ) );
