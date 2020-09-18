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

}
