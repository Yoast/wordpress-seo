<?php

namespace Yoast\WP\SEO\Services\Options;

/**
 * The multisite options service class.
 */
class Multisite_Options_Service extends Site_Options_Service {

	/**
	 * Retrieves the filtered option values.
	 *
	 * Override this method to implement a filter.
	 *
	 * @param array $values The option values.
	 *
	 * @return array The filtered option values.
	 */
	protected function get_filtered_values( array $values ) {
		/**
		 * Filter `wpseo_multisite_options_values`. Allows to override the option values.
		 *
		 * @api array The option values.
		 */
		$filtered_values = \apply_filters( 'wpseo_multisite_options_values', $values );

		// Filter safety check.
		if ( ! \is_array( $filtered_values ) ) {
			return $values;
		}

		return $filtered_values;
	}

	/**
	 * Retrieves additional configurations.
	 *
	 * @param array $configurations The additional configurations to be validated.
	 *
	 * @return array Additional configurations.
	 */
	protected function get_additional_configurations( $configurations = [] ) {
		/**
		 * Filter 'wpseo_multisite_options_additional_configurations' - Allows developers to add option configurations.
		 *
		 * @see Abstract_Options_Service::$configurations
		 *
		 * @api array The option configurations.
		 */
		$additional_configurations = \apply_filters( 'wpseo_multisite_options_additional_configurations', $configurations );

		return parent::get_additional_configurations( $additional_configurations );
	}
}
