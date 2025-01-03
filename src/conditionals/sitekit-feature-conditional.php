<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional for the SITEKIT_FEATURE feature flag.
 */
class Sitekit_Feature_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'SITEKIT_FEATURE';
	}
}
