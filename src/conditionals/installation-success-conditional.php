<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the Installation Success screen.
 */
class Installation_Success_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the Installation Success feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'INSTALLATION_SUCCESS';
	}
}
