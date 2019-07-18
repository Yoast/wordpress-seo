<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Implements server-side user input validation.
 *
 * @since 11.8
 */
class Yoast_Input_Validation {

	/**
	 * Check whether an option group is a Yoast SEO setting.
	 *
	 * The normal pattern is 'yoast' . $option_name . 'options'.
	 *
	 * @since 11.8
	 *
	 * @param string $group_name The option group name.
	 *
	 * @return bool Whether or not it's an Yoast SEO option group.
	 */
	public static function is_yoast_option_group_name( $group_name ) {
		return ( false !== strpos( $group_name, 'yoast' ) );
	}

	/**
	 * Adds an error message to the document title when submitting a settings
	 * form and errors are returned.
	 *
	 * Uses the WordPress `admin_title` filter in the WPSEO_Option subclasses.
	 *
	 * @since 11.8
	 *
	 * @param string $admin_title The page title, with extra context added.
	 *
	 * @return string $admin_title The modified or original admin title.
	 */
	public static function yoast_admin_document_title_errors( $admin_title ) {
		$errors           = get_settings_errors();
		$there_are_errors = false;
		$count            = 0;

		foreach ( $errors as $error ) {
			// For now, filter the admin title only in the Yoast SEO settings pages.
			if ( self::is_yoast_option_group_name( $error['setting'] ) && $error['code'] !== 'settings_updated' ) {
				$there_are_errors = true;
				$count++;
			}
		}

		if ( $there_are_errors ) {
			return sprintf(
				/* translators: %1$s: amount of errors, %2$s: the admin page title */
				_n( 'The form contains %1$s error. %2$s', 'The form contains %1$s errors. %2$s', $count, 'wordpress-seo' ),
				number_format_i18n( $count ),
				$admin_title
			);
		}

		return $admin_title;
	}

	/**
	 * Checks whether a specific form input field was submitted with an invalid value.
	 *
	 * @since 11.8
	 *
	 * @param string $error_code Must be the same slug-name used for the field variable and for `add_settings_error()`.
	 *
	 * @return bool Whether or not the submitted input field contained an invalid value.
	 */
	public static function yoast_form_control_has_error( $error_code ) {
		$errors = get_settings_errors();

		foreach ( $errors as $error ) {
			if ( $error['code'] === $error_code ) {
				return true;
			}
		}

		return false;
	}
}
