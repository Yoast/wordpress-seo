<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the front-end inspector.
 *
 * @deprecated 19.5
 */
class Front_End_Inspector_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @deprecated 19.5
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.5' );
		return 'FRONT_END_INSPECTOR';
	}
}
