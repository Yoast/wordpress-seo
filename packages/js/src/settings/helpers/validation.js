/* eslint-disable camelcase */
import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { reduce } from "lodash";
import { addMethod, number, object, string, array } from "yup";
import { STORE_NAME } from "../constants";

const ALPHA_NUMERIC_VERIFY_REGEXP = /^[A-Za-z0-9_-]+$/;
const ALPHA_NUMERIC_UNTIL_F_VERIFY_REGEXP = /^[A-Fa-f0-9_-]+$/;
const TWITTER_HANDLE_REGEXP = /^[A-Za-z0-9_]{1,25}$/;
const TWITTER_URL_REGEXP = /^https?:\/\/(?:www\.)?(?:twitter|x)\.com\/(?<handle>[A-Za-z0-9_]{1,25})\/?$/;

const allowedMediaTypes = [ "image/jpeg", "image/png", "image/webp", "image/gif" ];

addMethod( number, "isMediaTypeImage", function() {
	return this.test(
		"isMediaTypeImage",
		__( "The selected file is not an image.", "wordpress-seo" ),
		input => {
			// Not required.
			if ( ! input ) {
				return true;
			}

			const media = select( STORE_NAME ).selectMediaById( input );
			// No metadata to validate: default to valid.
			if ( ! media ) {
				return true;
			}

			return media?.type === "image";
		}
	);
} );

addMethod( number, "isMediaMimeTypeAllowed", function() {
	return this.test(
		"isMediaMimeTypeAllowed",
		__( "The selected media type is not valid. Supported types are: JPG, PNG, WEBP and GIF.", "wordpress-seo" ),
		input => {
			const media = select( STORE_NAME ).selectMediaById( input );

			// No metadata to validate: default to valid.
			if ( ! media ) {
				return true;
			}

			return allowedMediaTypes.includes( media.mime );
		}
	);
} );

addMethod( string, "isValidTwitterUrlOrHandle", function() {
	return this.test(
		"isValidTwitterUrlOrHandle",
		__( "The profile is not valid. Please use only 1-25 letters, numbers and underscores or enter a valid X URL.", "wordpress-seo" ),
		input => {
			// Not required.
			if ( ! input ) {
				return true;
			}

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
			search_character_limit: number()
				.required( __( "Please enter a number between 1 and 50.", "wordpress-seo" ) )
				.min( 1, __( "The number you've entered is not between 1 and 50.", "wordpress-seo" ) )
				.max( 50, __( "The number you've entered is not between 1 and 50.", "wordpress-seo" ) ),
		} ),
		wpseo_social: object().shape( {
			og_default_image_id: number().isMediaTypeImage(),
			facebook_site: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
			mastodon_url: string().url( __( "The profile is not valid. Please enter a valid URL.", "wordpress-seo" ) ),
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
					[ `social-image-id-${ name }` ]: number().isMediaTypeImage().isMediaMimeTypeAllowed(),
				} ),
				...( hasArchive && {
					[ `social-image-id-ptarchive-${ name }` ]: number().isMediaTypeImage().isMediaMimeTypeAllowed(),
				} ),
			} ), {} ),
			...reduce( taxonomies, ( acc, { name } ) => ( {
				...acc,
				[ `social-image-id-tax-${ name }` ]: number().isMediaTypeImage().isMediaMimeTypeAllowed(),
			} ), {} ),
			"social-image-id-author-wpseo": number().isMediaTypeImage().isMediaMimeTypeAllowed(),
			"social-image-id-archive-wpseo": number().isMediaTypeImage().isMediaMimeTypeAllowed(),
			"social-image-id-tax-post_format": number().isMediaTypeImage().isMediaMimeTypeAllowed(),
		} ),
	} );
};
