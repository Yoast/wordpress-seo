<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the front-end inspector.
 */
class Front_End_Inspector_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'FRONT_END_INSPECTOR';
	}
}
