<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Filtering_Strategy_Factory;

/**
 * This class is responsible for taking a Schema_Piece_Collection and return another filtered Schema_Piece_Collection.
 */
class Schema_Pieces_Aggregator {

	/**
	 * The filtering strategy factory.
	 *
	 * @var Filtering_Strategy_Factory
	 */
	private $filtering_strategy_factory;

	/**
	 * The properties merger.
	 *
	 * @var Properties_Merger
	 */
	private $properties_merger;

	/**
	 * Class constructor
	 *
	 * @param Filtering_Strategy_Factory $filtering_strategy_factory The filtering strategy factory.
	 *                                                               @param Properties_Merger          $properties_merger          The properties merger.
	 */
	public function __construct( Filtering_Strategy_Factory $filtering_strategy_factory, Properties_Merger $properties_merger ) {
		$this->filtering_strategy_factory = $filtering_strategy_factory;
		$this->properties_merger          = $properties_merger;
	}

	/**
	 * Main orchestrator method: deduplicates, merges and filter properties.
	 *
	 * @param Schema_Piece_Collection $schema_pieces The schema pieces to aggregate.
	 *
	 * @return Schema_Piece_Collection The aggregated schema pieces.
	 */
	public function aggregate( Schema_Piece_Collection $schema_pieces ): Schema_Piece_Collection {
		$aggregated_schema = [];

		$filtering_strategy     = $this->filtering_strategy_factory->create();
		$filtered_schema_pieces = $filtering_strategy->filter( $schema_pieces );

		foreach ( $filtered_schema_pieces->to_array() as $piece ) {

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
		}

		// Return only the values to get rid of the keys (which are @id) and wrap in a collection.
		return new Schema_Piece_Collection( \array_values( $aggregated_schema ) );
	}
}
