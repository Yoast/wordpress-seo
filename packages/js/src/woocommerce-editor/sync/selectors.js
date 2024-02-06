import { store } from "@wordpress/core-data";
import { select } from "@wordpress/data";
import { STORES } from "../constants";

/**
 * Retrieves the product metadata.
 * @param {number} productId The product ID.
 * @returns {Object[]} The product metadata.
 */
export const getProductMetadata = ( productId ) => select( store )?.getEditedEntityRecord( "postType", "product", productId )?.meta_data;

/**
 * Retrieves the focus keyphrase.
 * @returns {string} The focus keyphrase.
 */
export const getFocusKeyphrase = () => select( STORES.editor )?.getFocusKeyphrase();

/**
 * Retrieves the SEO title.
 * @returns {string} The SEO title.
 */
export const getSeoTitle = () => select( STORES.editor )?.getSnippetEditorTitle();

/**
 * Retrieves the meta description.
 * @returns {string} The meta description.
 */
export const getMetaDescription = () => select( STORES.editor )?.getSnippetEditorDescription();
