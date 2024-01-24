<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_HelpScout
 *
 * @codeCoverageIgnore
 * @deprecated 20.3
 */
class WPSEO_HelpScout implements WPSEO_WordPress_Integration {

	/**
	 * WPSEO_HelpScout constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 20.3
	 *
	 * @param string $beacon_id   The beacon id.
	 * @param array  $pages       The pages where the beacon is loaded.
	 * @param array  $products    The products the beacon is loaded for.
	 * @param bool   $ask_consent Optional. Whether to ask for consent before loading in HelpScout.
	 */
	public function __construct( $beacon_id, array $pages, array $products, $ask_consent = false ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );
	}

	/**
	 * {@inheritDoc}
	 *
	 * @codeCoverageIgnore
	 * @deprecated 20.3
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3', 'HelpScout_Beacon::register_hooks' );
	}

	/**
	 * Enqueues the HelpScout script.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 20.3
	 *
	 * @return void
	 */
	public function enqueue_help_scout_script() {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3', 'HelpScout_Beacon::enqueue_help_scout_script' );
	}

	/**
	 * Outputs a small piece of javascript for the beacon.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 20.3
	 *
	 * @return void
	 */
	public function output_beacon_js() {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3', 'HelpScout_Beacon::output_beacon_js' );
	}
}
