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
	 * Images.
	 *
	 * @var array
	 */
	public $shown_images = array();

	/**
	 * Class constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Outputs the Twitter Card code on singular pages.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 */
	public function twitter() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return object
	 */
	public static function get_instance() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
} /* End of class */
