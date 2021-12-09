import { select } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { createDefaultReplacementVariableConfigurations, SEO_STORE_NAME } from "@yoast/seo-integration";
import { flatten, get, map, once, pick, values } from "lodash";

/**
 * Gets the parent title from the select element.
 *
 * @param {HTMLElement} select The select input.
 *
 * @returns {string} The parent title.
 */
const getParentTitle = ( select ) => {
	const title = get( select, `options.${ select?.selectedIndex }.text`, "" );

	return title === __( "(no parent)", "wordpress-seo" ) ? "" : title;
};

/**
 * Gets a set of replacement variable configurations, keyed by name for easy reference.
 *
 * These are the DRYed configurations, used in creating the sets per content type.
 * When a replacement differs per content type, it might not belong here.
 *
 * @returns {Object.<string, ReplacementVariableConfiguration>} Replacement variable configurations.
 */
const getConfigurations = once( () => ( {
	...createDefaultReplacementVariableConfigurations(),

	// Basic variables.
	sitename: {
		name: "sitename",
		label: __( "Site title", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sitename", "" ),
		isRecommended: true,
	},
	sitedesc: {
		name: "sitedesc",
		label: __( "Tagline", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sitedesc", "" ),
	},
	category: {
		name: "category",
		label: __( "Category", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.category", "" ),
	},
	primary_category: {
		name: "primary_category",
		label: __( "Primary category", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.primary_category", "" ),
		isRecommended: true,
	},
	searchphrase: {
		name: "searchphrase",
		label: __( "Search phrase", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.searchphrase", "" ),
	},
	sep: {
		name: "sep",
		label: __( "Separator", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sep", "" ),
		regexp: new RegExp( "%%sep%%(\\s*%%sep%%)*", "g" ),
		isRecommended: true,
	},

	// Advanced variables.
	pt_single: {
		name: "pt_single",
		label: __( "Post type (singular)", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pt_single", "" ),
	},
	pt_plural: {
		name: "pt_plural",
		label: __( "Post type (plural)", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pt_plural", "" ),
	},
	modified: {
		name: "modified",
		label: __( "Modified", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.modified", "" ),
	},
	id: {
		name: "id",
		label: __( "ID", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.id", "" ),
	},
	name: {
		name: "name",
		label: __( "Name", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.name", "" ),
	},
	user_description: {
		name: "user_description",
		label: __( "User description", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.user_description", "" ),
	},
	page: {
		name: "page",
		label: __( "Page", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.page", "" ),
	},
	pagetotal: {
		name: "pagetotal",
		label: __( "Page total", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pagetotal", "" ),
	},
	pagenumber: {
		name: "pagenumber",
		label: __( "Page number", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pagenumber", "" ),
	},

	// Deprecrated variables.
	currentdate: {
		name: "currentdate",
		label: __( "Current date", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentdate", "" ),
		isVisible: false,
	},
	currentday: {
		name: "currentday",
		label: __( "Current day", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentday", "" ),
		isVisible: false,
	},
	currentmonth: {
		name: "currentmonth",
		label: __( "Current month", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentmonth", "" ),
		isVisible: false,
	},
	currentyear: {
		name: "currentyear",
		label: __( "Current year", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentyear", "" ),
		isVisible: false,
	},
} ) );

/**
 * Creates the replacement variable configurations list for posts.
 *
 * @see [Overview of available variables]{@link https://yoast.com/help/list-available-snippet-variables-yoast-seo/}
 *
 * @returns {ReplacementVariableConfiguration[]} The replacement variable configurations for posts.
 */
export const createPostReplacementVariableConfigurations = () => [
	// Basic variables.
	...values( pick( getConfigurations(), [
		"date",
		"title",
		"sitename",
		"sitedesc",
		"excerpt",
		"excerpt_only",
		"category",
		"primary_category",
		"searchphrase",
		"sep",
	] ) ),
	{
		name: "parent_title",
		label: __( "Parent title", "wordpress-seo" ),
		getReplacement: () => getParentTitle( document.getElementById( "parent_id" ) ),
	},
	{
		name: "tag",
		label: __( "Tag", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.tag", "" ),
	},

	// Advanced variables.
	...values( pick( getConfigurations(), [ "id", "name", "page", "focus_keyphrase" ] ) ),

	// Custom fields.
	...map(
		get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.custom_fields", {} ),
		( value, key ) => ( {
			name: `cf_${ key }`,
			label: sprintf(
				// translators: %s expands to the name of the custom field.
				__( "%s (custom field)", "wordpress-seo" ),
				key,
			),
			getReplacement: () => value,
		} ),
	),

	// Custom taxonomies.
	...flatten( map(
		get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.custom_taxonomies", {} ),
		( { name, description }, key ) => {
			// translators: %s expands to the key of the custom taxonomy.
			const label = __( "%s (custom taxonomy)", "wordpress-seo" );

			return [
				{
					name: `ct_${ key }`,
					label: sprintf( label, key ),
					getReplacement: () => name,
				},
				{
					name: `ct_desc_${ key }`,
					label: sprintf( label, key ),
					getReplacement: () => description,
				},
			];
		},
	) ),

	// Deprecated variables.
	...values( pick( getConfigurations(), [ "currentdate", "currentday", "currentmonth", "currentyear" ] ) ),

	// AIOSEO imported variables.
	{
		name: "author_first_name",
		label: __( "Author first name", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.author_first_name", "" ),
		isVisible: false,
	},
	{
		name: "author_last_name",
		label: __( "Author last name", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.author_last_name", "" ),
		isVisible: false,
	},
	{
		name: "category_title",
		label: __( "Category title", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.category_title", "" ),
		isVisible: false,
	},
	{
		name: "permalink",
		label: __( "Permalink", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectPermalink(),
		isVisible: false,
	},
	{
		name: "post_content",
		label: __( "Post content", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectContent(),
		isVisible: false,
	},
	{
		name: "post_day",
		label: __( "Post day", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_day", "" ),
		isVisible: false,
	},
	{
		name: "post_month",
		label: __( "Post month", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_month", "" ),
		isVisible: false,
	},
	{
		name: "post_year",
		label: __( "Post year", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_year", "" ),
		isVisible: false,
	},

	// Keep non-applicable variables.
	{
		name: "category_description",
		label: __( "Category description", "wordpress-seo" ),
		getReplacement: () => "",
	},
	{
		name: "tag_description",
		label: __( "Tag description", "wordpress-seo" ),
		getReplacement: () => "",
	},
	{
		name: "term_description",
		label: __( "Term description", "wordpress-seo" ),
		getReplacement: () => "",
	},
];

/**
 * Creates the replacement variable configurations list for terms.
 *
 * @see [Overview of available variables]{@link https://yoast.com/help/list-available-snippet-variables-yoast-seo/}
 *
 * @returns {ReplacementVariableConfiguration[]} The replacement variable configurations for terms.
 */
export const createTermReplacementVariableConfigurations = () => [
	// Basic variables.
	...values( pick( getConfigurations(), [
		"date",
		"sitename",
		"sitedesc",
		"excerpt",
		"excerpt_only",
		"searchphrase",
		"sep",
	] ) ),
	{
		name: "parent_title",
		label: __( "Parent title", "wordpress-seo" ),
		getReplacement: () => getParentTitle( document.getElementById( "parent" ) ),
	},
	{
		name: "term_description",
		label: __( "Term description", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectContent(),
	},
	{
		name: "category_description",
		label: __( "Category description", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectContent(),
	},
	{
		name: "tag_description",
		label: __( "Tag description", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectContent(),
	},
	{
		name: "term_title",
		label: __( "Term title", "wordpress-seo" ),
		getReplacement: () => select( SEO_STORE_NAME ).selectTitle(),
	},
	{
		name: "term_hierarchy",
		label: __( "Term hierarchy", "wordpress-seo" ),
		getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.term_hierarchy", "" ),
	},

	// Advanced variables.
	...values( pick( getConfigurations(), [ "id", "page", "focus_keyphrase" ] ) ),

	// Deprecated variables.
	getConfigurations().currentyear,

	// Keep non-applicable variables.
	...values( pick( getConfigurations(), [ "title", "category", "primary_category" ] ) ),
];
