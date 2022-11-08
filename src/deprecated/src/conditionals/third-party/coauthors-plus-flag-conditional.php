<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Feature_Flag_Conditional;

/**
 * Feature flag conditional for the CoAuthors Plus integration.
 *
 * @deprecated 19.11
 */
class CoAuthors_Plus_Flag_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the CoAuthors Plus integration feature flag.
	 *
	 * @deprecated 19.11
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.11' );
		return 'COAUTHORS_PLUS';
	}
}
