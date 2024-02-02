import { createSelector, createSlice } from "@reduxjs/toolkit";
import { __, sprintf } from "@wordpress/i18n";
import { get, values } from "lodash";

/**
 * Adds '(default)' to the name of the default type.
 * @param {Object[]} schemaTypes The schema types.
 * @param {string} defaultType The default value to change the name for.
 * @returns {Object[]} The schema types.
 */
const highlightDefaultSchemaType = ( schemaTypes, defaultType ) => {
	// translators: %1$s expands to the schema type, e.g. "Web Page" or "Blog Post".
	const defaultString = __( "%1$s (default)", "wordpress-seo" );

	return schemaTypes.map( ( { label, value } ) => ( {
		value,
		label: value === defaultType ? sprintf( defaultString, label ) : label,
	} ) );
};

/**
 * @returns {Object} The initial state.
 */
export const createInitialSchemaState = () => ( {
	articleTypes: get( window, "wpseoScriptData.schema.articleTypes", {} ),
	articleTypeDefaults: get( window, "wpseoScriptData.schema.articleTypeDefaults", {} ),
	pageTypes: get( window, "wpseoScriptData.schema.pageTypes", {} ),
	pageTypeDefaults: get( window, "wpseoScriptData.schema.pageTypeDefaults", {} ),
} );

const slice = createSlice( {
	name: "schema",
	initialState: createInitialSchemaState(),
	reducers: {},
} );

const schemaSelectors = {
	selectSchema: state => get( state, "schema", {} ),
	selectArticleTypes: state => get( state, "schema.articleTypes", {} ),
	selectArticleTypeDefaults: state => get( state, "schema.articleTypeDefaults", {} ),
	selectPageTypes: state => get( state, "schema.pageTypes", {} ),
	selectPageTypeDefaults: state => get( state, "schema.pageTypeDefaults", {} ),
};
schemaSelectors.selectArticleTypeValues = createSelector(
	schemaSelectors.selectArticleTypes,
	articleTypes => values( articleTypes )
);
schemaSelectors.selectArticleTypeDefault = createSelector(
	[
		schemaSelectors.selectArticleTypeDefaults,
		( state, postType ) => postType,
	],
	( articleTypeDefaults, postType ) => get( articleTypeDefaults, postType, "None" )
);
schemaSelectors.selectArticleTypeValuesFor = createSelector(
	[
		schemaSelectors.selectArticleTypeValues,
		schemaSelectors.selectArticleTypeDefault,
	],
	( articleTypeValues, articleTypeDefault ) => highlightDefaultSchemaType( articleTypeValues, articleTypeDefault )
);
schemaSelectors.selectPageTypeValues = createSelector(
	schemaSelectors.selectPageTypes,
	pageTypes => values( pageTypes )
);
schemaSelectors.selectPageTypeDefault = createSelector(
	[
		schemaSelectors.selectPageTypeDefaults,
		( state, postType ) => postType,
	],
	( pageTypeDefaults, postType ) => get( pageTypeDefaults, postType, "WebPage" )
);
schemaSelectors.selectPageTypeValuesFor = createSelector(
	[
		schemaSelectors.selectPageTypeValues,
		schemaSelectors.selectPageTypeDefault,
	],
	( pageTypeValues, pageTypeDefault ) => highlightDefaultSchemaType( pageTypeValues, pageTypeDefault )
);

export { schemaSelectors };

export const schemaActions = slice.actions;

export default slice.reducer;
