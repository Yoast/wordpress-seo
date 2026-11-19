<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

/**
 * The Schema aggregation endpoint feature, which serves the schema map and the schema aggregator REST endpoints.
 */
class Schema_Aggregation_Endpoint_Feature extends Abstract_Feature {

	/**
	 * The key of the feature.
	 *
	 * @var string
	 */
	public const KEY = 'schema_aggregation_endpoint';

	/**
	 * Returns the key of the feature.
	 *
	 * @return string The key.
	 */
	public function get_key(): string {
		return self::KEY;
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	public function get_option_name(): string {
		return 'enable_schema_aggregation_endpoint';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return 'Schema aggregation endpoint';
	}
}
