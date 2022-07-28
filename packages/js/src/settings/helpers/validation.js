/* eslint-disable camelcase */
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { get } from "lodash";
import { object, string } from "yup";
import { STORE_NAME } from "../store";

export const validationSchema = object().shape( {
	wpseo: object().shape( {
		baiduverify: string().url( "bad" ),
	} ),
	wpseo_social: object().shape( {
		og_default_image_id: string().test(
			"isMediaImage",
			__( "The selected media type is not valid. Supported formats are: JPG, PNG, WEBP and GIF.", "wordpress-seo" ),
			mediaId => {
				if ( ! mediaId ) {
					// Allow empty
					return true;
				}
				const media = select( STORE_NAME ).selectMediaById( mediaId );
				return media?.media_type === "image";
			}
		),
	} ),
} );
