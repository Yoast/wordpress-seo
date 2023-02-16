<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the new indexables page.
 */
class Indexables_Page_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'INDEXABLES_PAGE';
	}
}
