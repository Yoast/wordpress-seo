<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the new indexables page.
 *
 * @deprecated 20.4
 * @codeCoverageIgnore
 */
class Indexables_Page_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the feature flag.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'INDEXABLES_PAGE';
	}
}
