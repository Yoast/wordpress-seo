import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Gets the pageType from the store.
 *
 * @returns {String} Page type.
 */
export const getPageType = () => defaultTo( select( EDITOR_STORE ).getPageType(), "" );

/**
 * Gets the articleType from the store.
 *
 * @returns {String} Article type.
 */
export const getArticleType = () => defaultTo( select( EDITOR_STORE ).getArticleType(), "" );
