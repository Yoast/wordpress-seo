import SchemaFields from "../../helpers/SchemaFields";

export const SET_PAGE_TYPE = "SET_PAGE_TYPE";
export const SET_ARTICLE_TYPE = "SET_ARTICLE_TYPE";
export const GET_SCHEMA_PAGE_DATA = "GET_SCHEMA_PAGE_DATA";
export const GET_SCHEMA_ARTICLE_DATA = "GET_SCHEMA_ARTICLE_DATA";
export const SET_DISCOVERY_IMAGE = "SET_DISCOVERY_IMAGE";
export const CLEAR_DISCOVERY_IMAGE = "CLEAR_DISCOVERY_IMAGE";

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

/**
 * An action creator for setting the google discovery image.
 *
 * @param {String} image The image object.
 *
 * @returns {object} The action object.
 */
export const setDiscoveryPreviewImage = ( image ) => {
	SchemaFields.imageUrl = image.url;
	SchemaFields.imageId = image.id;
	return { type: SET_DISCOVERY_IMAGE, image };
};

/**
 * An action creator for setting the socialPreview image.
 *
 * @returns {object} The action object.
 */
export const clearDiscoveryPreviewImage = () => {
	SchemaFields.imageUrl = "";
	SchemaFields.imageId = "";
	return { type: CLEAR_DISCOVERY_IMAGE };
};
