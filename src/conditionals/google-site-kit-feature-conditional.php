<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional for the GOOGLE_SITE_KIT_FEATURE feature flag.
 */
class Google_Site_Kit_Feature_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'GOOGLE_SITE_KIT_FEATURE';
	}
}
