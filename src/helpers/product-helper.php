<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Utils;

/**
 * A helper object for the Yoast products.
 */
class Product_Helper {

	/**
	 * Gets the product name.
	 *
	 * @return string
	 */
	public function get_product_name() {
		if ( $this->is_premium() ) {
			return 'Yoast SEO Premium';
		}

		return 'Yoast SEO';
	}

	/**
	 * Gets the product name in the head section.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->get_product_name() . ' plugin';
	}

	/**
	 * Checks if the installed version is Yoast SEO Premium.
	 *
	 * @codeCoverageIgnore It just wraps a static method.
	 *
	 * @return bool True when is premium.
	 */
	public function is_premium() {
		return WPSEO_Utils::is_yoast_seo_premium();
	}
}
