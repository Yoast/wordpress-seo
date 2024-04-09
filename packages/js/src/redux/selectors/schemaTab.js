import { get } from "lodash";

/**
 * Gets the defaultPageType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Default page type.
 */
export const getDefaultPageType = state => get( state, "schemaTab.defaultPageType", "" );

/**
 * Gets the pageType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Page type.
 */
export const getPageType = state => get( state, "schemaTab.pageType", "" );

/**
 * Gets the defaultArticleType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Default article type.
 */
export const getDefaultArticleType = state => get( state, "schemaTab.defaultArticleType", "" );

/**
 * Gets the articleType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Article type.
 */
export const getArticleType = state => get( state, "schemaTab.articleType", "" );

/**
 * Check if we should hide the Article Type input.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether the Article Type input should be hidden.
 */
export const getShowArticleTypeInput = state => get( state, "schemaTab.showArticleTypeInput", false );
