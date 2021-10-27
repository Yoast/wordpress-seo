<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Checks if the YOAST_SEO_GREEK_SUPPORT constant is set.
 *
 * @deprecated 17.5
 * @codeCoverageIgnore
 */
class Greek_Support_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 * 'YOAST_SEO_' is automatically prepended to it and it will be uppercased.
	 *
	 * @deprecated 17.5
	 * @codeCoverageIgnore
	 *
	 * @return string the name of the feature flag.
	 */
	public function get_feature_flag() {
		\_deprecated_function( __METHOD__, 'WPSEO 17.5' );
		return 'GREEK_SUPPORT';
	}
}
