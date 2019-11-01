<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

/**
 * Conditional that is only met when WooCommerce is active.
 */
class WooCommerce_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return class_exists( 'Woocommerce' );
	}
}
