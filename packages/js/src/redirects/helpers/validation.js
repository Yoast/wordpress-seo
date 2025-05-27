/* eslint-disable camelcase */
import { __ } from "@wordpress/i18n";
import { object, string } from "yup";

const RELATIVE_PATH_REGEXP = /^\/[A-Za-z0-9/_-]*$/;
const ABSOLUTE_URL_REGEXP = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;

/**
 * @returns {Object} Yup validation schema.
 */
export const createValidationSchema = () => {
	return object().shape( {
		oldURL: string()
			.required( __( "Old URL is required.", "wordpress-seo" ) )
			.matches(
				RELATIVE_PATH_REGEXP,
				__( "Old URL must be a valid relative path starting with a slash.", "wordpress-seo" )
			),
		newURL: string()
			.required( __( "New URL is required.", "wordpress-seo" ) )
			.matches(
				ABSOLUTE_URL_REGEXP,
				__( "Please enter a valid absolute URL for new URL.", "wordpress-seo" )
			),
	} );
};
