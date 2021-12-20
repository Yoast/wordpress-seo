<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the Wincher integration.
 */
class Wincher_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns the name of the Wincher integration feature flag.
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'WINCHER_INTEGRATION';
	}

	/**
	 * Override is_met to also make sure this isn't a multisite installation.
	 *
	 * @return bool
	 */
	public function is_met() {
		return parent::is_met() && ! \is_multisite();
	}
}
