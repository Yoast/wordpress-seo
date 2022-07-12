/* eslint-disable camelcase */
import { __ } from "@wordpress/i18n";
import { object, array, string } from "yup";

export const validationSchema = object().shape( {
	wpseo_social: object().shape( {
		facebook_site: string().url( __( "Please enter a valid URL.", "wordpress-seo" ) ),
		instagram_site: string().url( __( "Please enter a valid URL.", "wordpress-seo" ) ),
		twitter_site: string().url( __( "Please enter a valid URL.", "wordpress-seo" ) ),
		other_social_urls: array().of( string().url( __( "Please enter a valid URL.", "wordpress-seo" ) ) ),
	} ),
} );
