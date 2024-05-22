import { dispatch, select } from "@wordpress/data";
import { reduce } from "lodash";
import { STORES } from "../../shared-admin/constants";
import { META_FIELDS } from "./fields";

/**
 * Retrieves the product metadata.
 * @param {number} productId The product ID.
 * @returns {?Array<Object>} The product metadata.
 */
export const getProductMetadata = ( productId ) => select( STORES.wp.core )
	?.getEditedEntityRecord( "postType", "product", productId )?.meta_data;

/**
 * @returns {Object} The default metadata.
 */
export const getDefaultMetadata = () => select( STORES.editor ).selectAllDefaultMetadata();

/**
 * @returns {Object} The field selectors.
 */
export const getFieldSelectors = () => reduce( META_FIELDS, ( getters, { get }, field ) => {
	getters[ field ] = select( STORES.editor )?.[ get ];
	return getters;
}, {} );

/**
 * @returns {Object} The field dispatchers.
 */
export const getFieldDispatchers = () => reduce( META_FIELDS, ( setters, { set }, field ) => {
	setters[ field ] = dispatch( STORES.editor )?.[ set ];
	return setters;
}, {} );
