<?php

namespace Yoast\WP\SEO\WooCommerce_Editor\Framework;

use Automattic\WooCommerce\Utilities\FeaturesUtil;
use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the WooCommerce Product Block Editor feature is enabled.
 */
class WooCommerce_Product_Block_Editor_Conditional implements Conditional {

	/**
	 * Returns whether this conditional is met.
	 *
	 * @return bool Whether the conditional is met.
	 */
	public function is_met() {
		if ( ! \class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
			return false;
		}

		return FeaturesUtil::feature_is_enabled( 'product_block_editor' );
	}
}
