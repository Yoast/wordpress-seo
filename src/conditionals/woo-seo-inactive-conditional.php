<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when Yoast WooCommerce SEO is NOT active.
 */
class Woo_SEO_Inactive_Conditional implements Conditional {

	/**
	 * Returns `true` when Yoast WooCommerce SEO is not active.
	 *
	 * @return bool `true` when Yoast WooCommerce SEO is not installed or activated.
	 */
	public function is_met() {
		return ! \defined( 'WPSEO_WOO_VERSION' );
	}
}
