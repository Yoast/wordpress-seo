<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for Yoast SEO plugin related logic.
 */
class Yoast_Helper {

	/**
	 * Determines whether the plugin is active for the entire network.
	 *
	 * @return bool Whether or not the plugin is network-active.
	 */
	public function is_plugin_network_active() {
		static $network_active = null;

		if ( ! is_multisite() ) {
			return false;
		}

		// If a cached result is available, bail early.
		if ( $network_active !== null ) {
			return $network_active;
		}

		$network_active_plugins = wp_get_active_network_plugins();

		// Consider MU plugins and network-activated plugins as network-active.
		$network_active = strpos( wp_normalize_path( WPSEO_FILE ), wp_normalize_path( WPMU_PLUGIN_DIR ) ) === 0
							|| in_array( WP_PLUGIN_DIR . '/' . WPSEO_BASENAME, $network_active_plugins, true );

		return $network_active;
	}

	/**
	 * Determines if Yoast SEO is in development mode?
	 *
	 * Inspired by JetPack (https://github.com/Automattic/jetpack/blob/master/class.jetpack.php#L1383-L1406).
	 *
	 * @return bool
	 */
	public function is_development_mode() {
		$development_mode = false;

		if ( defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT === 'development' ) {
			$development_mode = true;
		}
		elseif ( defined( 'WPSEO_DEBUG' ) ) {
			$development_mode = WPSEO_DEBUG;
		}
		elseif ( site_url() && strpos( site_url(), '.' ) === false ) {
			$development_mode = true;
		}

		/**
		 * Filter the Yoast SEO development mode.
		 *
		 * @since 3.0
		 *
		 * @param bool $development_mode Is Yoast SEOs development mode active.
		 */
		return apply_filters( 'yoast_seo_development_mode', $development_mode );
	}

	/**
	 * Checks if the installed version is Yoast SEO Premium.
	 *
	 * @return bool True when is premium.
	 */
	public function is_premium() {
		return defined( 'WPSEO_PREMIUM_PLUGIN_FILE' );
	}
}
