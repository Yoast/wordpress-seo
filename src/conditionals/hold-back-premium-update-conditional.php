<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional for the HOLD_BACK_PREMIUM_UPDATE feature flag.
 */
class Hold_Back_Premium_Update_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'HOLD_BACK_PREMIUM_UPDATE';
	}
}
