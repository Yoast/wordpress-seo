import SchemaFields from "../../helpers/SchemaFields";

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
	SchemaFields.pageType = pageType;
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
	SchemaFields.articleType = articleType;
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
		pageType: SchemaFields.pageType,
		defaultPageType: SchemaFields.defaultPageType,
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
		articleType: SchemaFields.articleType,
		defaultArticleType: SchemaFields.defaultArticleType,
	};
};
