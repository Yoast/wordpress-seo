<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Watcher for the enable_schema_aggregation_endpoint option.
 *
 * Monitors the enable_schema_aggregation_endpoint option and sets a timestamp when first enabled.
 */
class Schema_Aggregator_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Schema_Aggregator_Watcher constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'update_option_wpseo', [ $this, 'check_schema_aggregator_enabled' ], 10, 2 );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.ParameterTypeHint.MissingTraversableTypeHintSpecification -- They can really be anything.

	/**
	 * Checks if the enable_schema_aggregation_endpoint option has been enabled for the first time.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return bool Whether the schema_aggregator_enabled_on timestamp was set.
	 */
	public function check_schema_aggregator_enabled( $old_value, $new_value ): bool {
		if ( $old_value === false ) {
			$old_value = [];
		}

		if ( ! \is_array( $old_value ) || ! \is_array( $new_value ) ) {
			return false;
		}

		$option_key    = 'enable_schema_aggregation_endpoint';
		$timestamp_key = 'schema_aggregation_endpoint_enabled_on';

		$old_enabled = isset( $old_value[ $option_key ] ) && (bool) $old_value[ $option_key ];
		$new_enabled = isset( $new_value[ $option_key ] ) && (bool) $new_value[ $option_key ];

		if ( ! $old_enabled && $new_enabled ) {
			$current_timestamp = $this->options_helper->get( $timestamp_key );

			if ( empty( $current_timestamp ) ) {
				$this->options_helper->set( $timestamp_key, \time() );
				return true;
			}
		}

		return false;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.ParameterTypeHint.MissingTraversableTypeHintSpecification
}
