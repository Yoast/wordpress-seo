<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

/**
 * Conditional that is only met when WooCommerce is active.
 */
class EDD_Conditional implements Conditional {

	/**
	 * Returns `true` when the WooCommerce plugin is installed and activated.
	 *
	 * @return bool `true` when the WooCommerce plugin is installed and activated.
	 */
	public function is_met() {
		return \class_exists( 'Easy_Digital_Downloads' );
	}
}
