<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This class handles the Twitter card functionality.
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
	 * Class constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );
	}

	/**
	 * Outputs the Twitter Card code on singular pages.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 */
	public function twitter() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @return object
	 */
	public static function get_instance() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
} /* End of class */
