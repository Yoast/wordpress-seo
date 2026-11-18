<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Checks if the YOAST_SEO_DYNAMIC_PRODUCT_PERMALINKS constant is set.
 */
class Dynamic_Product_Permalinks_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 * 'YOAST_SEO_' is automatically prepended to it and it will be uppercased.
	 *
	 * @return string the name of the feature flag.
	 */
	public function get_feature_flag() {
		return 'DYNAMIC_PRODUCT_PERMALINKS';
	}
}
