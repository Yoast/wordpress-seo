<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for site environment.
 */
class Environment_Helper {

	/**
	 * Determines if the site is running on production.
	 *
	 * @return bool True if WordPress is currently running on production, false for all other environments.
	 */
	public function is_production_mode() {
		return $this->get_wp_environment() === 'production';
	}

	/**
	 * Determines on which environment WordPress is running.
	 *
	 * @return string The current WordPress environment.
	 */
	public function get_wp_environment() {
		return \wp_get_environment_type();
	}

	/**
	 * Determines if Yoast SEO is in development mode.
	 *
	 * Inspired by JetPack (https://github.com/Automattic/jetpack/blob/master/class.jetpack.php#L1383-L1406).
	 *
	 * @return bool Whether Yoast SEO is in development mode.
	 */
	public function is_yoast_seo_in_development_mode() {
		$development_mode = false;

		if ( \defined( 'YOAST_ENVIRONMENT' ) && \YOAST_ENVIRONMENT === 'development' ) {
			$development_mode = true;
		}
		elseif ( \defined( 'WPSEO_DEBUG' ) ) {
			$development_mode = \WPSEO_DEBUG;
		}
		elseif ( \site_url() && \strpos( \site_url(), '.' ) === false ) {
			$development_mode = true;
		}

		/**
		 * Filter: 'yoast_seo_development_mode' - Allows changing the Yoast SEO development mode.
		 *
		 * @param bool $development_mode Whether Yoast SEOs development mode is active.
		 */
		return \apply_filters( 'yoast_seo_development_mode', $development_mode );
	}
}
