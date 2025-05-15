import { POST_TYPE } from "../constants";

/**
 * Check if WooCommerce is active and the post type is a WooCommerce post type.
 *
 * @param {boolean} isWooCommerceActive The content type ('post' or 'term').
 * @param {string} postType The post type.
 * @returns {boolean} is WooCommerce active and the post type is a WooCommerce post type.
 */
export const isWooActiveAndProductPostType = ( isWooCommerceActive, postType ) =>
	isWooCommerceActive && [ POST_TYPE.product, POST_TYPE.productTag, POST_TYPE.productCategory ].includes( postType );
