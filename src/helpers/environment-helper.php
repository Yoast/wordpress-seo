<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for site environment.
 */
class Environment_Helper {

	/**
	 * Is the site running on production?
	 *
	 * @return bool true if the site is currently running on production, false for all other environments
	 */
	public function is_production_mode() {
		$production_mode = $this->get_yoast_environment();
		if ( isset( $production_mode ) ) {
			return $production_mode === 'production';
		} else {
			return $this->get_wp_environment() === 'production';
		}
	}

	/**
	 * A wrapper function to determine what environment the Yoast SEO is running at.
	 *
	 * @return string|null
	 */
	public function get_yoast_environment() {
		if ( defined( 'YOAST_ENVIRONMENT' ) ) {
			return YOAST_ENVIRONMENT;
		}

		return null;
	}

	/**
	 * This is a wrapper function to determine what environment wordpress is running at.
	 *
	 * @return string
	 */
	public function get_wp_environment() {
		return \wp_get_environment_type();
	}
}
