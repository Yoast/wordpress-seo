<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This class handles the Twitter card functionality.
 *
 * @deprecated 14.0
 *
 * @link https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards
 */
class WPSEO_Twitter {

	/**
	 * Instance of this class.
	 *
	 * @var object
	 */
	public static $instance;

	/**
	 * Images.
	 *
	 * @var array
	 */
	public $shown_images = [];

	/**
	 * Class constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Outputs the Twitter Card code on singular pages.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 */
	public function twitter() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return object
	 */
	public static function get_instance() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return null;
	}
} /* End of class */
