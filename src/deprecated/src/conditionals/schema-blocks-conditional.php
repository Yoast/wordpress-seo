<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Checks if the YOAST_SEO_SCHEMA_BLOCKS constant is set.
 *
 * @deprecated 20.5
 * @codeCoverageIgnore
 */
class Schema_Blocks_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 * 'YOAST_SEO_' is automatically prepended to it and it will be uppercased.
	 *
	 * @return string the name of the feature flag.
	 */
	protected function get_feature_flag() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.5' );
		return 'SCHEMA_BLOCKS';
	}
}
