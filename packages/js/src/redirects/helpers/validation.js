import { __ } from "@wordpress/i18n";
import { object, string } from "yup";

/**
 * @returns {Object} Yup validation schema.
 */
export const createValidationSchema = () => {
	return object().shape( {
		origin: string()
			.required( __( "The Old URL field can't be empty", "wordpress-seo" ) ),
		target: string()
			.required( __( "The New URL field can't be empty", "wordpress-seo" ) ),
	} );
};

/**
 * @returns {Object} Yup validation schema.
 */
export const updateValidationSchema = () => {
	return object().shape( {
		newOrigin: string()
			.required( __( "The Old URL field can't be empty", "wordpress-seo" ) ),
		newTarget: string()
			.required( __( "The New URL field can't be empty", "wordpress-seo" ) ),
	} );
};
