<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature flag conditional for the MyYoast connection.
 *
 * @deprecated 29.0
 * @codeCoverageIgnore
 */
class MyYoast_Connection_Conditional extends Feature_Flag_Conditional {

	/**
	 * Returns `true`: the MyYoast connection is available on every site.
	 *
	 * @deprecated 29.0
	 * @codeCoverageIgnore
	 *
	 * @return bool `true`.
	 */
	public function is_met() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 29.0' );
		return true;
	}

	/**
	 * Returns the feature name.
	 *
	 * @deprecated 29.0
	 * @codeCoverageIgnore
	 *
	 * @return string The name of the feature flag.
	 */
	public function get_feature_name() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 29.0' );
		return $this->get_feature_flag();
	}

	/**
	 * Returns the name of the feature flag.
	 *
	 * @deprecated 29.0
	 * @codeCoverageIgnore
	 *
	 * @return string The name of the feature flag.
	 */
	protected function get_feature_flag() {
		return 'MYYOAST_CONNECTION';
	}
}
