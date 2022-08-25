/* eslint-disable camelcase */
import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { reduce } from "lodash";
import { addMethod, number, object, string } from "yup";
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
 * @param {Object} postTypes The post types.
 * @param {Object} taxonomies The taxonomies.
 * @returns {Object} Yup validation schema.
 */
export const createValidationSchema = ( postTypes, taxonomies ) => {
	return object().shape( {
		wpseo: object().shape( {
			baiduverify: string()
				.matches( /^[A-Za-z0-9_-]+$/, "The verification code is not valid. Please use only letters, numbers, underscores and dashes." ),
			googleverify: string()
				.matches( /^[A-Za-z0-9_-]+$/, "The verification code is not valid. Please use only letters, numbers, underscores and dashes." ),
			msverify: string()
				.matches( /^[A-Fa-f0-9_-]+$/, "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes." ),
			yandexverify: string()
				.matches( /^[A-Fa-f0-9_-]+$/, "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes." ),
		} ),
		wpseo_social: object().shape( {
			og_default_image_id: number().isMediaTypeImage(),
			pinterestverify: string()
				.matches( /^[A-Fa-f0-9_-]+$/, "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes." ),
		} ),
		wpseo_titles: object().shape( {
			open_graph_frontpage_image_id: number().isMediaTypeImage(),
			// Media type image validation for all post type & taxonomy images.
			...reduce( postTypes, ( acc, { name, hasArchive } ) => ( {
				...acc,
				...( name !== "attachment" && {
					[ `social-image-id-${ name }` ]: number().isMediaTypeImage(),
				} ),
				...( hasArchive && {
					[ `social-image-id-ptarchive-${ name }` ]: number().isMediaTypeImage(),
				} ),
			} ), {} ),
			...reduce( taxonomies, ( acc, { name } ) => ( {
				...acc,
				[ `social-image-id-tax-${ name }` ]: number().isMediaTypeImage(),
			} ), {} ),
			"social-image-id-author-wpseo": number().isMediaTypeImage(),
			"social-image-id-archive-wpseo": number().isMediaTypeImage(),
			"social-image-id-tax-post_format": number().isMediaTypeImage(),
		} ),
	} );
};
