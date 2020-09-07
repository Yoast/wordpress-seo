<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Models\Indexable;

/**
 * A helper object for site environment.
 */
class Environment_Helper {

	/**
	 * Is the site running on production?
	 *
	 * @return bool true if the site is currently running on production, false for all other environments
	 */
	public static function is_production_mode() {
		$production_mode = false;

		if ( defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT === 'production' ) {
			$production_mode = true;
		}
		else {
			$production_mode = wp_get_environment_type() === 'production';
		}

		/**
		 * Filter the Yoast SEO production mode.
		 *
		 * @since 3.0
		 *
		 * @param bool $production_mode Is Yoast SEOs production mode active?
		 */
		return apply_filters( 'yoast_seo_production_mode', $production_mode );
	}
}
