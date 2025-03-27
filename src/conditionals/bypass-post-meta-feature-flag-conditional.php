<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when the Bypass Post Meta feature flag is enabled.
 */
class Bypass_Post_Meta_Feature_Flag_Conditional extends Feature_Flag_Conditional {
	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The feature flag.
	 */
	protected function get_feature_flag() {
		return 'BYPASS_POST_META';
	}
}
