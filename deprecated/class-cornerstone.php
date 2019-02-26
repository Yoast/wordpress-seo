<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the yoast cornerstone content.
 *
 * @deprecated 8.4
 */
class WPSEO_Cornerstone {

	/**
	 * @var string
	 */
	const META_NAME = 'is_cornerstone';

	/**
	 * @var string
	 */
	const FIELD_NAME = 'yoast_wpseo_is_cornerstone';

	/**
	 * WPSEO_Cornerstone constructor.
	 *
	 * @deprecated 8.4
	 */
	public function __construct() {
		_deprecated_constructor( 'WPSEO_Cornerstone', '8.4' );
	}

	/**
	 * Registers the hooks.
	 *
	 * @deprecated 8.4
	 *
	 * @return void
	 */
	public function register_hooks() {
		_deprecated_function( 'WPSEO_Cornerstone::register_hooks', '8.4' );
	}

	/**
	 * Saves the meta value to the database.
	 *
	 * @deprecated 8.4
	 *
	 * @param int $post_id The post id to save the meta value for.
	 *
	 * @return void
	 */
	public function save_meta_value( $post_id ) {
		_deprecated_function( 'WPSEO_Cornerstone::save_meta_value', '8.4' );
	}
}
