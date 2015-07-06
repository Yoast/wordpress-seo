<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Class WPSEO_Premium_Javascript_Strings
 */
class WPSEO_Premium_Javascript_Strings {

	/**
	 * @var null
	 */
	private static $strings = null;

	/**
	 * Fill the value of self::$strings with translated strings
	 */
	private static function fill() {
		self::$strings = array(
			'error_circular'        => __( 'You can\'t redirect a URL to itself.', 'wordpress-seo-premium' ),
			'error_old_url'         => __( 'The old URL field can\'t be empty.', 'wordpress-seo-premium' ),
			'error_regex'           => __( 'The Regular Expression field can\'t be empty.', 'wordpress-seo-premium' ),
			'error_new_url'         => __( 'The new URL field can\'t be empty.', 'wordpress-seo-premium' ),
			'error_saving_redirect' => __( 'Error while saving this redirect', 'wordpress-seo-premium' ),
			'error_new_type'        => __( 'New type can\'t be empty.', 'wordpress-seo-premium' ),
			'unsaved_redirects'     => __( 'You have unsaved redirects, are you sure you want to leave?', 'wordpress-seo-premium' ),
			/* translator note: %s is replaced with the URL that will be deleted */
			'enter_new_url'         => __( 'Please enter the new URL for %s', 'wordpress-seo-premium' ),
			/* translator note: variables will be replaced with from and to URLs */
			'redirect_saved'        => __( 'Redirect created from %1$s to %2$s!', 'wordpress-seo-premium' ),
			'redirect_possibly_bad' => __( 'Possibly bad redirect.', 'wordpress-seo-premium' ),
			'redirect_not_ok'       => __( 'The URL you entered returned a HTTP code different than 200(OK).', 'wordpress-seo-premium' ),
		);
	}

	/**
	 * Returns an array with all the translated strings
	 *
	 * @return array
	 */
	public static function strings() {
		if ( self::$strings === null ) {
			self::fill();
		}

		return self::$strings;
	}
}
