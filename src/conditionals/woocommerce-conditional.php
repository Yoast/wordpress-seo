<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when WooCommerce is active.
 */
class WooCommerce_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return \class_exists( 'WooCommerce' );
	}
}
