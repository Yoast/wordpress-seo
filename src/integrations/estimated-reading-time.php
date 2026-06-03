<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;

/**
 * Estimated reading time class.
 */
class Estimated_Reading_Time implements Integration_Interface {

	/**
	 * The Estimated Reading Time Conditional.
	 *
	 * @var Estimated_Reading_Time_Conditional
	 */
	protected $conditional;

	/**
	 * Constructs the Estimated Reading Time integration.
	 *
	 * @param Estimated_Reading_Time_Conditional $conditional The estimated reading time conditional.
	 */
	public function __construct( Estimated_Reading_Time_Conditional $conditional ) {
		$this->conditional = $conditional;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
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
		\add_filter( 'wpseo_metabox_entries_general', [ $this, 'remove_estimated_reading_time_hidden_fields' ] );
	}

	/**
	 * Adds or removes the estimated-reading-time hidden field.
	 *
	 * When the estimated reading time conditional is met the field is added.
	 * When it is not met the field is removed, so it does not show up in the metabox
	 * even though the meta key is always registered in $meta_fields.
	 *
	 * @deprecated 27.9
	 * @codeCoverageIgnore
	 * @param array<string, array<string, string|int|string[]>> $field_defs The $fields_defs.
	 *
	 * @return array<string, array<string, string|int|string[]>>
	 */
	public function add_estimated_reading_time_hidden_fields( $field_defs ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.9' );
		return $field_defs;
	}

	/**
	 * Removes the estimated-reading-time hidden field.
	 *
	 * When the estimated reading time conditional is not met the field is removed from hidden fields.
	 * But the field is registered by default.
	 *
	 * @param array<string, array<string, string|int|string[]>> $field_defs Metabox form field definitions, keyed by field name.
	 *
	 * @return array<string, array<string, string|int|string[]>>
	 */
	public function remove_estimated_reading_time_hidden_fields( $field_defs ) {
		if ( ! \is_array( $field_defs ) ) {
			return $field_defs;
		}

		if ( ! $this->conditional->is_met() ) {
			unset( $field_defs['estimated-reading-time-minutes'] );
		}

		return $field_defs;
	}
}
