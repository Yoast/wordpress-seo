<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Implements server-side user input validation.
 *
 * @since 12.0
 */
class Yoast_Input_Validation {

	/**
	 * Check whether an option group is a Yoast SEO setting.
	 *
	 * The normal pattern is 'yoast' . $option_name . 'options'.
	 *
	 * @since 12.0
	 *
	 * @param string $group_name The option group name.
	 *
	 * @return bool Whether or not it's an Yoast SEO option group.
	 */
	public static function is_yoast_option_group_name( $group_name ) {
		return ( strpos( $group_name, 'yoast' ) !== false );
	}

	/**
	 * Adds an error message to the document title when submitting a settings
	 * form and errors are returned.
	 *
	 * Uses the WordPress `admin_title` filter in the WPSEO_Option subclasses.
	 *
	 * @since 12.0
	 *
	 * @param string $admin_title The page title, with extra context added.
	 *
	 * @return string $admin_title The modified or original admin title.
	 */
	public static function add_yoast_admin_document_title_errors( $admin_title ) {
		$errors           = get_settings_errors();
		$error_count      = 0;

		foreach ( $errors as $error ) {
			// For now, filter the admin title only in the Yoast SEO settings pages.
			if ( self::is_yoast_option_group_name( $error['setting'] ) && $error['code'] !== 'settings_updated' ) {
				$error_count++;
			}
		}

		if ( $error_count > 0 ) {
			return sprintf(
				/* translators: %1$s: amount of errors, %2$s: the admin page title */
				_n( 'The form contains %1$s error. %2$s', 'The form contains %1$s errors. %2$s', $error_count, 'wordpress-seo' ),
				number_format_i18n( $error_count ),
				$admin_title
			);
		}

		return $admin_title;
	}
}
