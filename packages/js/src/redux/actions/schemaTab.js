import MetaboxFieldSync from "../../helpers/fields/MetaboxFieldSync";

export const SET_PAGE_TYPE = "SET_PAGE_TYPE";
export const SET_ARTICLE_TYPE = "SET_ARTICLE_TYPE";
export const GET_SCHEMA_PAGE_DATA = "GET_SCHEMA_PAGE_DATA";
export const GET_SCHEMA_ARTICLE_DATA = "GET_SCHEMA_ARTICLE_DATA";

/**
 * An action creator for setting the Page type.
 *
 * @param {string} pageType The page type to set.
 *
 * @returns {object} The action object.
 */
export const setPageType = ( pageType ) => {
	MetaboxFieldSync.setFieldValue( "schema_page_type", pageType );
	return { type: SET_PAGE_TYPE, pageType };
};

/**
 * An action creator for setting the Article type.
 *
 * @param {string} articleType The article type to set.
 *
 * @returns {object} The action object.
 */
export const setArticleType = ( articleType ) => {
	MetaboxFieldSync.setFieldValue( "schema_article_type", articleType );
	return { type: SET_ARTICLE_TYPE, articleType };
};

/**
 * An action creator for loading all Schema page data.
 *
 * @returns {object} The action object.
 */
export const getSchemaPageData = () => {
	return {
		type: GET_SCHEMA_PAGE_DATA,
		pageType: MetaboxFieldSync.getInitialValue( "schema_page_type" ),
		defaultPageType: MetaboxFieldSync.getInitialValue( "schema_page_type_default" ),
	};
};

/**
 * An action creator for loading all Schema article data.
 *
 * @returns {object} The action object.
 */
export const getSchemaArticleData = () => {
	return {
		type: GET_SCHEMA_ARTICLE_DATA,
		articleType: MetaboxFieldSync.getInitialValue( "schema_article_type" ),
		defaultArticleType: MetaboxFieldSync.getInitialValue( "schema_article_type_default" ),
	};
};
