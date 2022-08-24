/* eslint-disable camelcase */
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { object, number, addMethod } from "yup";
import { includes, get, reduce } from "lodash";
import { STORE_NAME } from "../constants";

addMethod( number, "isMediaTypeImage", function() {
	return this.test(
		"isMediaTypeImage",
		__( "The selected media type is not valid. Supported types are: JPG, PNG, WEBP and GIF.", "wordpress-seo" ),
		mediaId => {
			if ( ! mediaId ) {
				return true;
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
export const createValidationSchema = settings => {
	const titleSettings = get( settings, "wpseo_titles", {} );

	return object().shape( {
		// wpseo: object().shape( {
		// 	baiduverify: string().url( "bad" ),
		// } ),
		wpseo_social: object().shape( {
			og_default_image_id: number().isMediaTypeImage(),
		} ),
		wpseo_titles: object().shape( {
			open_graph_frontpage_image_id: number().isMediaTypeImage(),
			// Media type image validation for all post type & taxonomy images.
			...reduce( titleSettings, ( acc, value, key ) => includes( key, "social-image-id" ) ? {
				...acc,
				[ key ]: number().isMediaTypeImage(),
			} : acc, {} ),
		} ),
	} );
};
