<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Class WPSEO_GWT
 *
 * @todo delete this class
 */
class WPSEO_GWT {

	const OPTION_REFRESH_TOKEN = 'wpseo-premium-gwt-refresh_token';

	/**
	 * @var WPSEO_GWT
	 */
	private static $instance = null;

	/**
	 * @var String
	 */
	private $access_token = null;

	/**
	 * Singleton getter
	 *
	 * @return WPSEO_GWT
	 */
	public static function get() {
		if ( null == self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * The constructor
	 */
	public function __construct() {

	}

	/**
	 * Save the refresh token
	 *
	 * @param $refresh_token
	 */
	private function save_refresh_token( $refresh_token ) {
		update_option( self::OPTION_REFRESH_TOKEN, $refresh_token );
	}

	/**
	 * Get the refresh token
	 *
	 * @return mixed|void
	 */
	private function get_refresh_token() {
		return get_option( self::OPTION_REFRESH_TOKEN, null );
	}


}