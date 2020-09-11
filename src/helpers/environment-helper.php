<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for site environment.
 */
class Environment_Helper {

	/**
	 * Determines wheter the site is running on production.
	 *
	 * @return bool true if the site is currently running on production, false for all other environments
	 */
	public function is_production_mode() {
		$production_mode = $this->get_yoast_environment();
		if ( isset( $production_mode ) ) {
			return $production_mode === 'production';
		}
		else {
			return $this->get_wp_environment() === 'production';
		}
	}

	/**
	 * Determines on which environment the Yoast SEO is running.
	 *
	 * @return string|null The current Yoast SEO environment
	 */
	public function get_yoast_environment() {
		if ( defined( 'YOAST_ENVIRONMENT' ) ) {
			return YOAST_ENVIRONMENT;
		}

		return null;
	}

	/**
	 * Determines on which environment Wordpress is running.
	 *
	 * @return string The current Wordpress environment
	 */
	public function get_wp_environment() {
		return \wp_get_environment_type();
	}
}
