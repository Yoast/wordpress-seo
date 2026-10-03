<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map;

use InvalidArgumentException;

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
		$base_map = $this->base_loader->load();

		$map = \apply_filters( 'wpseo_schema_aggregator_elements_context_map', $base_map );
		try {
			$this->validate_main_map_lightweight( $map );

			foreach ( $map as $context => $elements ) {
				$filtered_elements = \apply_filters( "wpseo_schema_aggregator_elements_context_map_{$context}", $elements );
				$this->validate_elements_array( $filtered_elements );
				$map[ $context ] = $filtered_elements;
			}
		} catch ( InvalidArgumentException $exception ) {
			return $base_map;
		}

		return $map;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- We expect this to be anything the user provides.

	/**
	 * Lightweight validation for the main map - only checks structure, not contents.
	 *
	 * @param mixed $map The map to validate.
	 *
	 * @throws InvalidArgumentException When the map format is invalid.
	 *
	 * @return void
	 */
	private function validate_main_map_lightweight( $map ): void {
		if ( ! \is_array( $map ) ) {
			throw new InvalidArgumentException( 'Filter "wpseo_schema_aggregator_elements_context_map" must return an array' );
		}

		if ( ! empty( $map ) ) {
			// Check only the first key-value pair for performance.
			$first_key   = \array_key_first( $map );
			$first_value = $map[ $first_key ];

			if ( ! \is_string( $first_key ) ) {
				throw new InvalidArgumentException(
					'Filter "wpseo_schema_aggregator_elements_context_map" must return an array with string keys (context names).',
				);
			}

			if ( ! \is_array( $first_value ) ) {
				throw new InvalidArgumentException(
					'Filter "wpseo_schema_aggregator_elements_context_map" must return an array with array values (element lists).',
				);
			}
		}
	}

	/**
	 * Validates that the elements array has the correct format.
	 *
	 * @param mixed $elements The elements array to validate.
	 *
	 * @throws InvalidArgumentException When the elements format is invalid.
	 *
	 * @return void
	 */
	private function validate_elements_array( $elements ): void {
		if ( ! \is_array( $elements ) ) {
			throw new InvalidArgumentException( 'Filter "wpseo_schema_aggregator_elements_context_map_*" must return an array of string element names.' );
		}

		foreach ( $elements as $element ) {
			if ( ! \is_string( $element ) ) {
				throw new InvalidArgumentException( 'Filter "wpseo_schema_aggregator_elements_context_map_*" must return an array of string element names.' );
			}
		}
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- We expect this to be anything the user provides.
}
