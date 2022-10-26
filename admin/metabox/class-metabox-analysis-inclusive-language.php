<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Metabox
 */

/**
 * Represents the inclusive language analysis.
 */
class WPSEO_Metabox_Analysis_Inclusive_Language implements WPSEO_Metabox_Analysis {

	/**
	 * Whether this analysis is enabled.
	 *
	 * @return bool Whether or not this analysis is enabled.
	 */
	public function is_enabled() {
		return $this->is_globally_enabled() && $this->is_user_enabled()
				&& YoastSEO()->helpers->language->has_inclusive_language_support( \WPSEO_Language_Utils::get_language( \get_locale() ) );
	}

	/**
	 * Whether or not this analysis is enabled by the user.
	 *
	 * @return bool Whether or not this analysis is enabled by the user.
	 */
	public function is_user_enabled() {
		return ! get_the_author_meta( 'wpseo_inclusive_language_analysis_disable', get_current_user_id() );
	}

	/**
	 * Whether or not this analysis is enabled globally.
	 *
	 * @return bool Whether or not this analysis is enabled globally.
	 */
	public function is_globally_enabled() {
		return WPSEO_Options::get( 'inclusive_language_analysis_active', false );
	}
}
