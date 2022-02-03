import { select } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { replacementVariableConfigurations, SEO_STORE_NAME } from "@yoast/seo-integration";
import { get, map } from "lodash";

/**
 * Gets the parent title from the select element.
 *
 * @param {HTMLElement} selectElement The select input.
 *
 * @returns {string} The parent title.
 */
const getParentTitle = ( selectElement ) => {
	const selectedValue = get( selectElement, "value", "" );
	// The no parent value is an empty string on hierarchical post types, and `-1` (string) on hierarchical taxonomies.
	if ( selectedValue === "" || selectedValue === "-1" ) {
		return "";
	}

	return get( selectElement, `options.${ selectElement?.selectedIndex }.text`, "" );
};

// Basic variables.
export const category = {
	name: "category",
	getLabel: () => __( "Category", "wordpress-seo" ),
	getReplacement: () => {
		const categories = select( SEO_STORE_NAME ).selectCategories();
		return categories.map( cat => cat.name ).join( ", " );
	},
};

export const categoryDescription = {
	name: "category_description",
	getLabel: () => __( "Category description", "wordpress-seo" ),
	getReplacement: replacementVariableConfigurations.content.getReplacement,
};

export const parentTitle = {
	name: "parent_title",
	getLabel: () => __( "Parent title", "wordpress-seo" ),
	getReplacement: () => getParentTitle( document.getElementById( "parent_id" ) || document.getElementById( "parent" ) ),
};

export const primaryCategory = {
	name: "primary_category",
	getLabel: () => __( "Primary category", "wordpress-seo" ),
	getReplacement: () => {
		// Gets the primary category data from `yoast-seo/editor` store.
		const primaryTaxonomyIdFromStore = select( "yoast-seo/editor" ).getPrimaryTaxonomyId( "category" );
		const initialPrimaryTaxonomyId = get( window, "wpseoPrimaryCategoryL10n.taxonomies.category.primary" );

		// Uses the id from wpseoPrimaryCategoryL10n global variable if `yoast-seo/editor` store returns an undefined primary category id.
		const primaryTaxonomyId = primaryTaxonomyIdFromStore || initialPrimaryTaxonomyId;
		const categories = select( SEO_STORE_NAME ).selectCategories();

		return categories.find( cat => cat.id === primaryTaxonomyId.toString() ).name;
	},
};

export const searchPhrase = {
	name: "searchphrase",
	getLabel: () => __( "Search phrase", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.searchphrase", "" ),
};

export const separator = {
	name: "sep",
	getLabel: () => __( "Separator", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sep", "" ),
	regexp: new RegExp( "%%sep%%(\\s*%%sep%%)*", "g" ),
};

export const siteName = {
	name: "sitename",
	getLabel: () => __( "Site title", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sitename", "" ),
};

export const siteDescription = {
	name: "sitedesc",
	getLabel: () => __( "Tagline", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sitedesc", "" ),
};

export const tag = {
	name: "tag",
	getLabel: () => __( "Tag", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.tag", "" ),
};

export const tagDescription = {
	name: "tag_description",
	getLabel: () => __( "Tag description", "wordpress-seo" ),
	getReplacement: replacementVariableConfigurations.content.getReplacement,
};

export const termDescription = {
	name: "term_description",
	getLabel: () => __( "Term description", "wordpress-seo" ),
	getReplacement: replacementVariableConfigurations.content.getReplacement,
};

export const termHierarchy = {
	name: "term_hierarchy",
	getLabel: () => __( "Term hierarchy", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.term_hierarchy", "" ),
};

export const termTitle = {
	name: "term_title",
	getLabel: () => __( "Term title", "wordpress-seo" ),
	getReplacement: () => replacementVariableConfigurations.title.getReplacement,
};


// Advanced variables.
export const postTypeSingular = {
	name: "pt_single",
	getLabel: () => __( "Post type (singular)", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pt_single", "" ),
};

export const postTypePlural = {
	name: "pt_plural",
	getLabel: () => __( "Post type (plural)", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pt_plural", "" ),
};

export const modified = {
	name: "modified",
	getLabel: () => __( "Modified", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.modified", "" ),
};

export const id = {
	name: "id",
	getLabel: () => __( "ID", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.id", "" ),
};

export const userName = {
	name: "name",
	getLabel: () => __( "Name", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.name", "" ),
};

export const userDescription = {
	name: "user_description",
	getLabel: () => __( "User description", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.user_description", "" ),
};

export const page = {
	name: "page",
	getLabel: () => __( "Page", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.page", "" ),
};

export const pageTotal = {
	name: "pagetotal",
	getLabel: () => __( "Page total", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pagetotal", "" ),
};

export const pageNumber = {
	name: "pagenumber",
	getLabel: () => __( "Page number", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pagenumber", "" ),
};

export const customFields = map(
	get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.custom_fields", {} ),
	( value, key ) => ( {
		name: `cf_${ key }`,
		getLabel: () => sprintf(
			// translators: %s expands to the name of the custom field.
			__( "%s (custom field)", "wordpress-seo" ),
			key
		),
		getReplacement: () => value,
	} )
);

export const customTaxonomies = map(
	get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.custom_taxonomies", {} ),
	( { name }, key ) => ( {
		name: `ct_${ key }`,
		getLabel: () => sprintf(
			// translators: %s expands to the key of the custom taxonomy.
			__( "%s (custom taxonomy)", "wordpress-seo" ),
			key
		),
		getReplacement: () => name,
	} )
);

export const customTaxonomyDescriptions = map(
	get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.custom_taxonomies", {} ),
	( { description }, key ) => ( {
		name: `ct_desc_${ key }`,
		getLabel: () => sprintf(
			// translators: %s expands to the key of the custom taxonomy.
			__( "%s description (custom taxonomy)", "wordpress-seo" ),
			key
		),
		getReplacement: () => description,
	} )
);


// Deprecated variables.
export const currentDate = {
	name: "currentdate",
	getLabel: () => __( "Current date", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentdate", "" ),
};

export const currentDay = {
	name: "currentday",
	getLabel: () => __( "Current day", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentday", "" ),
};

export const currentMonth = {
	name: "currentmonth",
	getLabel: () => __( "Current month", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentmonth", "" ),
};

export const currentYear = {
	name: "currentyear",
	getLabel: () => __( "Current year", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentyear", "" ),
};


// Imported variables.
export const authorFirstname = {
	name: "author_first_name",
	getLabel: () => __( "Author first name", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.author_first_name", "" ),
};
export const authorLastname = {
	name: "author_last_name",
	getLabel: () => __( "Author last name", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.author_last_name", "" ),
};
export const categoryTitle = {
	name: "category_title",
	getLabel: () => __( "Category title", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.category_title", "" ),
};
export const postDay = {
	name: "post_day",
	getLabel: () => __( "Post day", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_day", "" ),
};
export const postMonth = {
	name: "post_month",
	getLabel: () => __( "Post month", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_month", "" ),
};
export const postYear = {
	name: "post_year",
	getLabel: () => __( "Post year", "wordpress-seo" ),
	getReplacement: () => get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_year", "" ),
};
