<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 9.2' );

/**
 * Class to implement a React modal.
 *
 * @deprecated 9.2
 */
class Yoast_Modal {

	/**
	 * Class constructor.
	 *
	 * @deprecated 9.2
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, '9.2' );
	}

	/**
	 * Enqueues the assets needed for the modal.
	 *
	 * @deprecated 9.2
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		_deprecated_function( 'Yoast_Modal::enqueue_assets', '9.2' );
	}

	/**
	 * Prints the modals configuration.
	 *
	 * @return void
	 */
	public function print_localized_config() {
		_deprecated_function( 'Yoast_Modal::print_localized_config', '9.2' );
	}

	/**
	 * Adds a single modal configuration to the modals configuration.
	 *
	 * @deprecated 9.2
	 *
	 * @param array $args The modal configuration arguments.
	 *
	 * @return void
	 */
	public static function add( $args ) {
		_deprecated_function( 'Yoast_Modal::add', '9.2' );
	}

	/**
	 * Gets the modals configuration.
	 *
	 * @deprecated 9.2
	 *
	 * @return void
	 */
	public function get_config() {
		_deprecated_function( 'Yoast_Modal::get_config', '9.2' );
	}

	/**
	 * Gets the default configuration for a modal.
	 *
	 * @deprecated 9.2
	 *
	 * @return void
	 */
	public static function get_defaults() {
		_deprecated_function( 'Yoast_Modal::get_defaults', '9.2' );
	}
}
