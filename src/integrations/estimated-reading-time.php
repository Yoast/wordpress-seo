<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;

/**
 * Estimated reading time class.
 */
class Estimated_Reading_Time implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ Estimated_Reading_Time_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'add_extra_wpseo_meta_fields', [ $this, 'add_estimated_reading_time_hidden_fields' ] );
	}

	/**
	 * Adds the estimated-reading-time hidden field to the Yoast meta fields.
	 *
	 * Hooked to `add_extra_wpseo_meta_fields` so the field is registered for
	 * REST API access and the metabox via the normal WPSEO_Meta::init() loop.
	 *
	 * @param array<string, array<string, array<string, string>>> $extra_fields The extra meta fields passed through the filter.
	 *
	 * @return array<string, array<string, array<string, string>>>
	 */
	public function add_estimated_reading_time_hidden_fields( $extra_fields ) {
		if ( ! \is_array( $extra_fields ) ) {
			$extra_fields = [];
		}

		$extra_fields['general']['estimated-reading-time-minutes'] = [
			'type'  => 'hidden',
			'title' => 'estimated-reading-time-minutes',
		];

		return $extra_fields;
	}
}
