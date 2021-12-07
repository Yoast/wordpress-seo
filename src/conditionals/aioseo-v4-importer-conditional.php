<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the AIOSEO V4 importer.
 */
class AIOSEO_V4_Importer_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the AiOSEO feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'AIOSEO_V4_IMPORTER';
	}
}
