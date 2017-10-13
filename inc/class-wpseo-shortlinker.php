<?php
/**
 * @package WPSEO
 */

/**
 * Helps with creating shortlinks in the plugin
 */
class WPSEO_Shortlinker {

	/**
	 * @var string
	 */
	protected $version;

	/**
	 * @param string $version The version to put in the utm_content tag.
	 */
	public function __construct( $version ) {
		$this->version = $version;
	}

	/**
	 * Builds a URL to use in the plugin as shortlink.
	 *
	 * @param string $url The URL to build upon.
	 *
	 * @return string The final URL.
	 */
	public function build_shortlink( $url ) {
		return $url . '?utm_content=' . $this->version;
	}

	/**
	 * Returns a version of the URL with a utm_content with the current version.
	 *
	 * @param string $url The URL to build upon.
	 *
	 * @return string The final URL.
	 */
	public static function get( $url ) {
		$version = WPSEO_VERSION;

		$version = apply_filters( 'wpseo_shortlink_version', $version );

		$shortlinker = new WPSEO_Shortlinker( $version );

		return $shortlinker->build_shortlink( $url );
	}

	/**
	 * Echoes a version of the URL with a utm_content with the current version.
	 *
	 * @param string $url The URL to build upon.
	 */
	public static function show( $url ) {
		echo esc_url( self::get( $url ) );
	}
}
