/* eslint-disable camelcase */
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { object, string, number, addMethod } from "yup";
import { includes, get, reduce } from "lodash";
import { STORE_NAME } from "../store";

addMethod( number, "isMediaTypeImage", function( isRequired = false ) {
	return this.test(
		"isMediaTypeImage",
		__( "The selected media type is not valid. Supported types are: JPG, PNG, WEBP and GIF.", "wordpress-seo" ),
		mediaId => {
			if ( mediaId ) {
				return ! isRequired;
			}
			const media = select( STORE_NAME ).selectMediaById( mediaId );
			return media?.type === "image";
		}
	);
} );

/**
 * @param {Object} settings The initial settings.
 * @returns {Object} Yup validation schema.
 */
export const createValidationSchema = ( settings ) => {
	const titleSettings = get( settings, "wpseo_titles", {} );

	return object().shape( {
		// wpseo: object().shape( {
		// 	baiduverify: string().url( "bad" ),
		// } ),
		wpseo_social: object().shape( {
			og_default_image_id: number().isMediaTypeImage(),
		} ),
		wpseo_titles: object().shape( {
			// Media type image validation for all content & taxonomy images.
			...reduce( titleSettings, ( acc, value, key ) => includes( key, "social-image-id" ) ? {
				...acc,
				[ key ]: number().isMediaTypeImage(),
			} : acc, {} ),
		} ),
	} );
};
