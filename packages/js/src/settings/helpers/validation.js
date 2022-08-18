/* eslint-disable camelcase */
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { object, number, addMethod, string } from "yup";
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
 * Transforms the value to the content of the content tag.
 *
 * If the value is a HTML tag, e.g. `<meta content="foo" />`.
 * Then this function will return `foo`.
 * Otherwise, the original value will be returned.
 *
 * @param {string} value The value.
 * @returns {string} The original value or the value of the content tag.
 */
const transformContentTag = value => {
	const match = value.match( /content=(['"])?(?<content>[^'"> ]+)(?:\1|[ />])/ );
	return match?.groups?.content ? match.groups.content : value;
};

/**
 * @param {Object} settings The initial settings.
 * @returns {Object} Yup validation schema.
 */
export const createValidationSchema = settings => {
	const titleSettings = get( settings, "wpseo_titles", {} );

	return object().shape( {
		wpseo: object().shape( {
			baiduverify: string()
				.transform( transformContentTag )
				.matches( /^[A-Za-z0-9_-]+$/, "The verification code is not valid. Please use only letters, numbers, underscores and dashes." ),
			googleverify: string()
				.transform( transformContentTag )
				.matches( /^[A-Za-z0-9_-]+$/, "The verification code is not valid. Please use only letters, numbers, underscores and dashes." ),
			msverify: string()
				.transform( transformContentTag )
				.matches( /^[A-Fa-f0-9_-]+$/, "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes." ),
			yandexverify: string()
				.transform( transformContentTag )
				.matches( /^[A-Fa-f0-9_-]+$/, "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes." ),
		} ),
		wpseo_social: object().shape( {
			og_default_image_id: number().isMediaTypeImage(),
			pinterestverify: string()
				.transform( transformContentTag )
				.matches( /^[A-Fa-f0-9_-]+$/, "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes." ),
		} ),
		wpseo_titles: object().shape( {
			open_graph_frontpage_image_id: number().isMediaTypeImage(),
			// Media type image validation for all post type & taxonomy images.
			...reduce( titleSettings, ( acc, value, key ) => includes( key, "social-image-id" ) ? {
				...acc,
				[ key ]: number().isMediaTypeImage(),
			} : acc, {} ),
			"social-image-id-tax-post_format": number().isMediaTypeImage(),
		} ),
	} );
};
