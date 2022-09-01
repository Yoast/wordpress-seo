<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Metabox
 */

/**
 * Represents the inclusive language analysis.
 *
 * @deprecated 19.6.1
 * @codeCoverageIgnore
 */
class WPSEO_Metabox_Analysis_Inclusive_Language implements WPSEO_Metabox_Analysis {

	/**
	 * Initialize the inclusive language analysis metabox.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 19.6.1' );
	}

	/**
	 * Whether this analysis is enabled.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not this analysis is enabled.
	 */
	public function is_enabled() {
		_deprecated_function( __METHOD__, 'WPSEO 19.6.1' );
		return $this->is_globally_enabled() && $this->is_user_enabled() && $this->is_current_version_supported()
				&& YoastSEO()->helpers->product->is_premium()
				&& YoastSEO()->helpers->language->has_inclusive_language_support( \WPSEO_Language_Utils::get_language( \get_locale() ) );
	}

	/**
	 * Whether or not this analysis is enabled by the user.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not this analysis is enabled by the user.
	 */
	public function is_user_enabled() {
		_deprecated_function( __METHOD__, 'WPSEO 19.6.1' );
		return ! get_the_author_meta( 'wpseo_inclusive_language_analysis_disable', get_current_user_id() );
	}

	/**
	 * Whether or not this analysis is enabled globally.
	 *
	 * @return bool Whether or not this analysis is enabled globally.
	 */
	public function is_globally_enabled() {
		_deprecated_function( __METHOD__, 'WPSEO 19.6.1' );
		return WPSEO_Options::get( 'inclusive_language_analysis_active', false );
	}

	/**
	 * Whether or not a certain premium version support inclusive language feature.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not a certain premium version support inclusive language feature.
	 */
	private function is_current_version_supported() {
		_deprecated_function( __METHOD__, 'WPSEO 19.6.1' );
		$is_premium      = YoastSEO()->helpers->product->is_premium();
		$premium_version = YoastSEO()->helpers->product->get_premium_version();

		return $is_premium && \version_compare( $premium_version, '19.2-RC1', '>=' );
	}
}
