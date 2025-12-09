<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map;

/**
 * Map loader that applies filters to the elements-context map.
 */
class Filtered_Map_Loader implements Map_Loader_Interface {

	/**
	 * The base map loader strategy.
	 *
	 * @var Map_Loader_Interface
	 */
	private $base_loader;

	/**
	 * Class constructor.
	 *
	 * @param Map_Loader_Interface $base_loader The base map loader strategy.
	 */
	public function __construct( Map_Loader_Interface $base_loader ) {
		$this->base_loader = $base_loader;
	}

	/**
	 * Loads a filtered elements-context map.
	 *
	 * @return array<string, array<string, string>> The filtered elements-context map.
	 */
	public function load(): array {
		$map = $this->base_loader->load();

		$map = \apply_filters( 'wpseo_schema_aggregator_elements_context_map', $map );

		foreach ( $map as $context => $elements ) {
			$map[ $context ] = \apply_filters( "wpseo_schema_aggregator_elements_context_map_{$context}", $elements );
		}

		return $map;
	}
}
