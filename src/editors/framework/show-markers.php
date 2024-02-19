<?php

namespace Yoast\WP\SEO\Editors\Framework;

/**
 * Describes if the show markers feature should be enabled.
 */
class Show_Markers implements Analysis_Feature_Interface {

	/**
	 * Whether this analysis is enabled.
	 *
	 * @return bool Whether this analysis is enabled.
	 */
	public function is_enabled(): bool {
		/**
		 * Filter to determine if the markers should be enabled or not.
		 *
		 * @param bool $showMarkers Should the markers being enabled. Default = true.
		 */
		return \apply_filters( 'wpseo_enable_assessment_markers', true );
	}

	/**
	 * Returns the name of the object.
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'markers';
	}

	/**
	 * Gets the legacy key.
	 *
	 * @return string The legacy key.
	 */
	public function get_legacy_key(): string {
		return 'show_markers';
	}
}
