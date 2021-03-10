<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Abstract class for creating conditionals based on feature flags.
 */
abstract class Feature_Flag_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		$feature_flag = \strtoupper( static::get_feature_flag() );

		/**
		 * Filter: 'wpseo_enable_feature_flags' - Allows filtering the enabled feature flags.
		 *
		 * @api array - The enabled feature flags.
		 */
		if ( in_array( $feature_flag, apply_filters( 'wpseo_enable_feature_flags', [] ) ) ) {
			return true;
		}

		return \defined( 'YOAST_SEO_' . $feature_flag ) && \constant( 'YOAST_SEO_' . $feature_flag ) === true;
	}

	/**
	 * Returns the name of the feature flag.
	 * 'YOAST_SEO_' is automatically prepended to it and it will be uppercased.
	 *
	 * @return string the name of the feature flag.
	 */
	abstract public static function get_feature_flag();
}
