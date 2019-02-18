<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Validation
 */

/**
 * Handles form inputs validation.
 */
class WPSEO_Validation {

	/**
	 * Validation patterns for input constraint validation API.
	 *
	 * @var array
	 */
	public static $patterns = array(
		'facebook_site'   => '^https:\/\/www\.facebook\.com\/[^\s\/]+',
		'instagram_url'   => '^https:\/\/www\.instagram\.com\/[^\s\/]+',
		'linkedin_url'    => '^https:\/\/www\.linkedin\.com\/in\/[^\s\/]+',
		'myspace_url'     => '^https:\/\/myspace\.com\/[^\s\/]+',
		'pinterest_url'   => '^https:\/\/www\.pinterest\.com\/[^\s\/]+',
		'youtube_url'     => '^https:\/\/www\.youtube\.com\/[^\s\/]+',
		'google_plus_url' => '^https:\/\/plus\.google\.com\/[^\s\/]+',
	);

	/**
	 * Retrieves a validation pattern.
	 *
	 * @param string $key The key of the validation pattern to retrieve.
	 *
	 * @return string The validation pattern to use or empty string if not found.
	 */
	public static function get_pattern( $key ) {
		if ( isset( self::$patterns[ $key ] ) ) {
			return self::$patterns[ $key ];
		}

		return '';
	}
}
