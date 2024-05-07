<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Customizer
 */

/**
 * Class with functionality to support WP SEO settings in WordPress Customizer.
 *
 * @codeCoverageIgnore
 * @deprecated 22.8
 */
class WPSEO_Customizer {

	/**
	 * Holds the customize manager.
	 *
	 * @deprecated 22.8
	 *
	 * @var WP_Customize_Manager
	 */
	protected $wp_customize;

	/**
	 * Construct Method.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 22.8
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'Yoast SEO 22.8' );
	}

	/**
	 * Function to support WordPress Customizer.
	 *
	 * @param WP_Customize_Manager $wp_customize Manager class instance.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 22.8
	 *
	 * @return void
	 */
	public function wpseo_customize_register( $wp_customize ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 22.8' );
	}

	/**
	 * Returns whether or not the breadcrumbs are active.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 22.8
	 *
	 * @return void
	 */
	public function breadcrumbs_active_callback() {
		_deprecated_function( __METHOD__, 'Yoast SEO 22.8' );
	}

	/**
	 * Returns whether or not to show the breadcrumbs blog show option.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 22.8
	 *
	 * @return void
	 */
	public function breadcrumbs_blog_show_active_cb() {
		_deprecated_function( __METHOD__, 'Yoast SEO 22.8' );
	}
}
