<?php
/**
 * A helper object to retrieve the product name.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

/**
 * Class Product_Helper
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
	protected function is_premium() {
		return \WPSEO_Utils::is_yoast_seo_premium();
	}
}
