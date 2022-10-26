<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Declares compatibility with the WooCommerce HPOS feature.
 */
class Woocommerce implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * Hooks into WooCommerce.
	 */
	public function initialize() {
			\add_action( 'before_woocommerce_init', [ $this, 'declare_custom_order_tables_compatibility' ] );
	}

	/**
	 * Declares compatibility with the WooCommerce HPOS feature.
	 */
	public function declare_custom_order_tables_compatibility() {
		if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', WPSEO_FILE, true );
		}
	}
}
