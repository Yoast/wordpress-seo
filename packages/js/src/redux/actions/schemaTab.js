export const SET_PAGE_TYPE = "SET_PAGE_TYPE";
export const SET_ARTICLE_TYPE = "SET_ARTICLE_TYPE";

/**
 * An action creator for setting the Page type.
 *
 * @param {string} pageType The page type to set.
 *
 * @returns {object} The action object.
 */
export const setPageType = ( pageType ) => {
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
	return { type: SET_ARTICLE_TYPE, articleType };
};
