<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the new dashboard UI.
 */
class New_Dashboard_Ui_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'NEW_DASHBOARD_UI';
	}
}
