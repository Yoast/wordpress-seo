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
	 * The name of the boolean option that enables the feature.
	 *
	 * @var string
	 */
	public const OPTION_NAME = 'enable_schema_aggregation_endpoint';

	/**
	 * The human-readable name of the feature.
	 *
	 * @var string
	 */
	public const NAME = 'Schema aggregation endpoint';
}
