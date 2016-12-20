<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * This code handles the Google+ specific output that's not covered by OpenGraph.
 *
 * @deprecated 3.2 - Google+ uses OpenGraph data when there is no specific Google+ data provided.
 */
class WPSEO_GooglePlus {

	/**
	 * @var    object    Instance of this class
	 */
	public static $instance;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		_deprecated_constructor( __CLASS__, 'WPSEO 3.2' );
	}

	/**
	 * Get the singleton instance of this class
	 *
	 * @return object
	 */
	public static function get_instance() {
		_deprecated_function( __METHOD__, '3.2' );

		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Output the Google+ specific content
	 *
	 * @deprecated 3.2
	 */
	public function output() {
		_deprecated_function( 'WPSEO_GooglePlus::output', '3.2' );
	}

	/**
	 * Output the Google+ specific description
	 *
	 * @deprecated 3.2
	 */
	public function description() {
		_deprecated_function( 'WPSEO_GooglePlus::description', '3.2' );
	}

	/**
	 * Output the Google+ specific title
	 *
	 * @deprecated 3.2
	 */
	public function google_plus_title() {
		_deprecated_function( 'WPSEO_GooglePlus::google_plus_title', '3.2' );
	}

	/**
	 * Output the Google+ specific image
	 */
	public function google_plus_image() {
		_deprecated_function( 'WPSEO_GooglePlus::google_plus_image', '3.2' );
	}
}
