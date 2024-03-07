import { select } from "@wordpress/data";
import { STORE } from "../../shared-admin/constants";

/**
 * Gets the pageType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Page type.
 */
export const getPageType = () => select( STORE )?.getPageType();

/**
 * Gets the articleType from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Article type.
 */
export const getArticleType = () => select( STORE )?.getArticleType();
