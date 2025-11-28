<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Filtering_Strategy_Factory;

/**
 * This class is responsible for taking an array of Schema_Pieces and return another array of Schema_Pieces where:
 * 1. Schema_Pieces are deduplicated by using the id property
 * 2. if a copy of the same Schema_Piece exists, properties are merged together
 * 3. properties in the avoid list are unset
 *
 * @param array<Schema_Piece> $schema_pieces The schema pieces to aggregate.
 */
class Schema_Pieces_Aggregator {

	/**
	 * The properties filter instance.
	 *
	 * @var Properties_Filter
	 */
	private $properties_filter;

	/**
	 * The properties merger object
	 *
	 * @var Properties_Merger
	 */
	private $properties_merger;

	/**
	 * The filtering strategy factory.
	 *
	 * @var Filtering_Strategy_Factory
	 */
	private $filtering_strategy_factory;

	/**
	 * Class constructor
	 *
	 * @param Properties_Filter          $properties_filter          The properties filter object.
	 * @param Properties_Merger          $properties_merger          The properties merger object.
	 * @param Filtering_Strategy_Factory $filtering_strategy_factory The filtering strategy factory.
	 */
	public function __construct( Properties_Filter $properties_filter, Properties_Merger $properties_merger, Filtering_Strategy_Factory $filtering_strategy_factory ) {
		$this->properties_filter          = $properties_filter;
		$this->properties_merger          = $properties_merger;
		$this->filtering_strategy_factory = $filtering_strategy_factory;
	}

	/**
	 * Main orchestrator method: deduplicates, merges and filter properties.
	 *
	 * @param array<Schema_Piece> $schema_pieces The schema pieces to aggregate.
	 *
	 * @return array<Schema_Piece> The aggregated schema pieces.
	 */
	public function aggregate( array $schema_pieces ): array {
		$aggregated_schema = [];

		$filtering_strategy     = $this->filtering_strategy_factory->create();
		$filtered_schema_pieces = $filtering_strategy->filter( $schema_pieces );

		foreach ( $filtered_schema_pieces as $piece ) {

			$id = $piece->get_id();
			if ( \is_null( $id ) ) {
				continue;
			}

			if ( isset( $aggregated_schema[ $id ] ) ) {

				$aggregated_schema[ $id ] = $this->properties_merger->merge( $aggregated_schema[ $id ], $piece );
			}
			else {
				// Add new piece.
				$aggregated_schema[ $id ] = $piece;
			}

			$aggregated_schema[ $id ] = $this->properties_filter->filter( $aggregated_schema[ $id ] );
		}

		// Return only the values to get rid of the keys (which are @id).
		return \array_values( $aggregated_schema );
	}
}
