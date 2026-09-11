<?php
// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- Reason: Field definitions contain values of varying types that cannot be expressed without mixed.

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;

/**
 * Estimated reading time class.
 */
class Estimated_Reading_Time implements Integration_Interface {

	/**
	 * The estimated reading time conditional.
	 *
	 * @var Estimated_Reading_Time_Conditional
	 */
	private $estimated_reading_time_conditional;

	/**
	 * Constructs the Estimated_Reading_Time integration.
	 *
	 * @param Estimated_Reading_Time_Conditional $estimated_reading_time_conditional The estimated reading time conditional.
	 */
	public function __construct( Estimated_Reading_Time_Conditional $estimated_reading_time_conditional ) {
		$this->estimated_reading_time_conditional = $estimated_reading_time_conditional;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ Post_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_metabox_entries_general', [ $this, 'filter_estimated_reading_time_field_def' ], 10, 2 );
	}

	/**
	 * Adds an estimated-reading-time hidden field.
	 *
	 * @deprecated 28.5
	 * @codeCoverageIgnore
	 *
	 * @param array<string, array<string, mixed>> $field_defs The $fields_defs.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function add_estimated_reading_time_hidden_fields( $field_defs ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.5', 'Estimated_Reading_Time::filter_estimated_reading_time_field_def' );
		if ( \is_array( $field_defs ) ) {
			$field_defs['estimated-reading-time-minutes'] = [
				'type'  => 'hidden',
				'title' => 'estimated-reading-time-minutes',
			];
		}

		return $field_defs;
	}

	/**
	 * Removes the estimated-reading-time field from the metabox field definitions when not applicable.
	 *
	 * @param array<string, array<string, mixed>> $field_defs The metabox field definitions.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function filter_estimated_reading_time_field_def( $field_defs ) {
		if ( ! \is_array( $field_defs ) ) {
			return $field_defs;
		}

		if ( ! $this->estimated_reading_time_conditional->is_met() ) {
			unset( $field_defs['estimated-reading-time-minutes'] );
		}

		return $field_defs;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
