<?php

namespace Yoast\WP\SEO\Integrations;

/**
 * Estimated reading time class.
 *
 * @deprecated 22.8
 * @codeCoverageIgnore
 */
class Estimated_Reading_Time implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 22.8
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.8' );
		return [];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 22.8
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.8' );
		\add_filter( 'wpseo_metabox_entries_general', [ $this, 'add_estimated_reading_time_hidden_fields' ] );
	}

	/**
	 * Adds an estimated-reading-time hidden field.
	 *
	 * @deprecated 22.8
	 * @codeCoverageIgnore
	 *
	 * @param array $field_defs The $fields_defs.
	 *
	 * @return array
	 */
	public function add_estimated_reading_time_hidden_fields( $field_defs ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.8' );
		if ( \is_array( $field_defs ) ) {
			$field_defs['estimated-reading-time-minutes'] = [
				'type'  => 'hidden',
				'title' => 'estimated-reading-time-minutes',
			];
		}

		return $field_defs;
	}
}
