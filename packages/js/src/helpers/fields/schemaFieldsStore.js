import { select } from "@wordpress/data";
import { STORE } from "../../constants";

/**
 * Gets the defaultPageType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Default page type.
 */
export const getDefaultPageType = () => select( STORE )?.getDefaultPageType();

/**
 * Gets the pageType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Page type.
 */
export const getPageType = () => select( STORE )?.getPageType();

/**
 * Gets the defaultArticleType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Default article type.
 */
export const getDefaultArticleType = () => select( STORE )?.getDefaultArticleType();

/**
 * Gets the articleType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Article type.
 */
export const getArticleType = () => select( STORE )?.getArticleType();
