<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object to retrieve the product name.
 */
class Product_Helper {

	/**
	 * Get the product name in the head section.
	 *
	 * @return string
	 */
	public function get_name() {
		if ( $this->is_premium() ) {
			return 'Yoast SEO Premium plugin';
		}

		return 'Yoast SEO plugin';
	}

	/**
	 * Checks if the installed version is Yoast SEO Premium.
	 *
	 * @codeCoverageIgnore It just wraps a static method.
	 *
	 * @return bool True when is premium.
	 */
	public function is_premium() {
		return defined( 'WPSEO_PREMIUM_PLUGIN_FILE' );
	}

	/**
	 * Determine if Yoast SEO is in development mode?
	 *
	 * Inspired by JetPack (https://github.com/Automattic/jetpack/blob/master/class.jetpack.php#L1383-L1406).

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
	 * Check if the current opened page belongs to Yoast SEO Free.
	 *
	 * @since 3.3.0
	 *
	 * @param string $current_page The current page the user is on.
	 *
	 * @return bool
	 */
	public function is_free_page( $current_page ) {
		$yoast_seo_free_pages = [
			'wpseo_dashboard',
			'wpseo_titles',
			'wpseo_social',
			'wpseo_advanced',
			'wpseo_tools',
			'wpseo_search_console',
			'wpseo_licenses',
		];

		return in_array( $current_page, $yoast_seo_free_pages, true );
	}
}
