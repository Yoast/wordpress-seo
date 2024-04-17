import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Gets the pageType from the store.
 *
 * @returns {String} Page type.
 */
export const getPageType = () => defaultTo( select( STORE_NAME_EDITOR.free ).getPageType(), "" );

/**
 * Gets the articleType from the store.
 *
 * @returns {String} Article type.
 */
export const getArticleType = () => defaultTo( select( STORE_NAME_EDITOR.free ).getArticleType(), "" );
