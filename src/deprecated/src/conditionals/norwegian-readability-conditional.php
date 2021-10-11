<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Checks if the YOAST_SEO_NORWEGIAN_READABILITY constant is set.
 *
 * @deprecated 16.8
 * @codeCoverageIgnore
 */
class Norwegian_Readability_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 * 'YOAST_SEO_' is automatically prepended to it and it will be uppercased.
	 *
	 * @deprecated 16.8
	 * @codeCoverageIgnore
	 *
	 * @return string the name of the feature flag.
	 */
	public function get_feature_flag() {
		\_deprecated_function( __METHOD__, 'WPSEO 16.8' );
		return 'NORWEGIAN_READABILITY';
	}
}
