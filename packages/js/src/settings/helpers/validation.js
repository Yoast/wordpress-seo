/* eslint-disable camelcase */
import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { reduce } from "lodash";
import { addMethod, number, object, string, array } from "yup";
import { STORE_NAME } from "../constants";

const ALPHA_NUMERIC_VERIFY_REGEXP = /^[A-Za-z0-9_-]+$/;
const ALPHA_NUMERIC_UNTIL_F_VERIFY_REGEXP = /^[A-Fa-f0-9_-]+$/;

addMethod( number, "isMediaTypeImage", function() {
	return this.test(
		"isMediaTypeImage",
		__( "The selected media type is not valid. Supported types are: JPG, PNG, WEBP and GIF.", "wordpress-seo" ),
		input => {
			// Not required.
			if ( ! input ) {
				return true;
			}
			const media = select( STORE_NAME ).selectMediaById( input );
			return media?.type === "image";
		}
	);
} );

addMethod( string, "isValidTwitterUrlOrHandle", function() {
	return this.test(
		"isValidTwitterUrlOrHandle",
		__( "The profile is not valid. Please use only 1-25 letters, numbers and underscores or enter a valid Twitter URL.", "wordpress-seo" ),
		input => {
			// Not required.
			if ( ! input ) {
				return true;
			}

			const TWITTER_HANDLE_REGEXP = /^[A-Za-z0-9_]{1,25}$/;
			const TWITTER_URL_REGEXP = /^https?:\/\/(?:www\.)?twitter\.com\/(?<handle>[A-Za-z0-9_]{1,25})\/?$/;

			return TWITTER_HANDLE_REGEXP.test( input ) || TWITTER_URL_REGEXP.test( input );
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
				.matches( ALPHA_NUMERIC_VERIFY_REGEXP, __( "The verification code is not valid. Please use only letters, numbers, underscores and dashes.", "wordpress-seo" ) ),
			googleverify: string()
				.matches( ALPHA_NUMERIC_VERIFY_REGEXP, __( "The verification code is not valid. Please use only letters, numbers, underscores and dashes.", "wordpress-seo" ) ),
			msverify: string()
				.matches( ALPHA_NUMERIC_UNTIL_F_VERIFY_REGEXP, __( "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes.", "wordpress-seo" ) ),
			yandexverify: string()
				.matches( ALPHA_NUMERIC_UNTIL_F_VERIFY_REGEXP, __( "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes.", "wordpress-seo" ) ),
		} ),
		wpseo_social: object().shape( {
			og_default_image_id: number().isMediaTypeImage(),
			facebook_site: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			twitter_site: string().isValidTwitterUrlOrHandle(),
			other_social_urls: array().of(
				string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) )
			),
			pinterestverify: string()
				.matches( ALPHA_NUMERIC_UNTIL_F_VERIFY_REGEXP, __( "The verification code is not valid. Please use only the letters A to F, numbers, underscores and dashes.", "wordpress-seo" ) ),
		} ),
		wpseo_titles: object().shape( {
			open_graph_frontpage_image_id: number().isMediaTypeImage(),
			company_logo_id: number().isMediaTypeImage(),
			person_logo_id: number().isMediaTypeImage(),
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
		person_social_profiles: object().shape( {
			facebook: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			instagram: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			linkedin: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			myspace: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			pinterest: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			soundcloud: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			tumblr: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			twitter: string().isValidTwitterUrlOrHandle(),
			youtube: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			wikipedia: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
		} ),
	} );
};
