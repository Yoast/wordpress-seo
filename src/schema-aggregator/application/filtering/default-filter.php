<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering;

use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\Schema_Node_Filter_Decider_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\Base_Schema_Node_Property_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\Schema_Node_Property_Filter_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository_Interface;

/**
 * Default filtering strategy implementation.
 */
class Default_Filter implements Filtering_Strategy_Interface {

	private const NODE_FILTER_NAMESPACE     = 'Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\\';
	private const PROPERTY_FILTER_NAMESPACE = 'Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\\';
	private const NODE_FILTER_SUFFIX        = '_Schema_Node_Filter';
	private const PROPERTY_FILTER_SUFFIX    = '_Schema_Node_Property_Filter';

	/**
	 * The categories to filter.
	 *
	 * @var array<string>
	 */
	private const FILTER_CATEGORIES = [
		'action',
		'enumeration',
		'meta',
		'website-meta',
	];

	/**
	 * The elements context map repository.
	 *
	 * @var Elements_Context_Map_Repository_Interface
	 */
	private $elements_context_map_repository;

	/**
	 * Class constructor.
	 *
	 * @param Elements_Context_Map_Repository_Interface $elements_context_map_repository The elements-context map
	 *                                                                                   repository.
	 */
	public function __construct( Elements_Context_Map_Repository_Interface $elements_context_map_repository ) {
		$this->elements_context_map_repository = $elements_context_map_repository;
	}

	/**
	 * Applies filtering to the given schema.
	 *
	 * @param Schema_Piece_Collection $schema The schema to be filtered.
	 *
	 * @return Schema_Piece_Collection The filtered schema.
	 */
	public function filter( Schema_Piece_Collection $schema ): Schema_Piece_Collection {
		$filtered_schema      = [];
		$elements_context_map = $this->elements_context_map_repository->get_map();

		foreach ( $schema->to_array() as $schema_piece ) {
			$piece_types = (array) $schema_piece->get_type();

			if ( ! $this->should_keep_piece( $piece_types, $elements_context_map, $schema, $schema_piece ) ) {
				continue;
			}

			$filtered_schema[] = $this->apply_property_filters( $schema_piece, $piece_types );
		}

		return new Schema_Piece_Collection( $filtered_schema );
	}

	/**
	 * Determines if a schema piece should be kept based on all its types.
	 *
	 * A piece is kept if at least one of its types should be kept.
	 *
	 * @param array<string>                $types                The types to check.
	 * @param array<string, array<string>> $elements_context_map The elements context map.
	 * @param Schema_Piece_Collection      $schema               The full schema collection.
	 * @param Schema_Piece                 $schema_piece         The schema piece being checked.
	 *
	 * @return bool Whether to keep the schema piece.
	 */
	private function should_keep_piece(
		array $types,
		array $elements_context_map,
		Schema_Piece_Collection $schema,
		Schema_Piece $schema_piece
	): bool {
		foreach ( $types as $type ) {
			if ( $this->should_keep_type( $type, $elements_context_map, $schema, $schema_piece ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Determines if a schema piece should be kept based on a single type.
	 *
	 * @param string                       $type                 The type to check.
	 * @param array<string, array<string>> $elements_context_map The elements context map.
	 * @param Schema_Piece_Collection      $schema               The full schema collection.
	 * @param Schema_Piece                 $schema_piece         The schema piece being checked.
	 *
	 * @return bool Whether to keep the schema piece.
	 */
	private function should_keep_type(
		string $type,
		array $elements_context_map,
		Schema_Piece_Collection $schema,
		Schema_Piece $schema_piece
	): bool {
		foreach ( self::FILTER_CATEGORIES as $category ) {
			if ( ! \in_array( $type, $elements_context_map[ $category ], true ) ) {
				continue;
			}

			$filter = $this->get_node_filter( $type );

			return ( $filter !== null && $filter->should_filter( $schema, $schema_piece ) );
		}

		return true;
	}

	/**
	 * Gets a node filter instance for the given type.
	 *
	 * @param string $type The schema type.
	 *
	 * @return Schema_Node_Filter_Decider_Interface|null The filter instance or null if not found.
	 */
	private function get_node_filter( string $type ): ?Schema_Node_Filter_Decider_Interface {
		$filter_class = self::NODE_FILTER_NAMESPACE . $type . self::NODE_FILTER_SUFFIX;

		if ( \class_exists( $filter_class ) && \is_a( $filter_class, Schema_Node_Filter_Decider_Interface::class, true ) ) {
			return new $filter_class();
		}

		return null;
	}

	/**
	 * Applies property filters for all types of a schema piece.
	 *
	 * @param Schema_Piece  $schema_piece The schema piece to filter.
	 * @param array<string> $types        The types of the schema piece.
	 *
	 * @return Schema_Piece The filtered schema piece.
	 */
	private function apply_property_filters( Schema_Piece $schema_piece, array $types ): Schema_Piece {
		$filtered_piece   = $schema_piece;
		$filter_was_found = false;

		foreach ( $types as $type ) {
			$filter = $this->get_property_filter( $type );
			if ( $filter !== null ) {
				$filtered_piece   = $filter->filter_properties( $filtered_piece );
				$filter_was_found = true;
			}
		}

		if ( ! $filter_was_found ) {
			return ( new Base_Schema_Node_Property_Filter() )->filter_properties( $schema_piece );
		}

		return $filtered_piece;
	}

	/**
	 * Gets a property filter instance for the given type.
	 *
	 * @param string $type The schema type.
	 *
	 * @return Schema_Node_Property_Filter_Interface|null The filter instance or null if not found.
	 */
	private function get_property_filter( string $type ): ?Schema_Node_Property_Filter_Interface {
		$filter_class = self::PROPERTY_FILTER_NAMESPACE . $type . self::PROPERTY_FILTER_SUFFIX;

		if ( \class_exists( $filter_class ) && \is_a( $filter_class, Schema_Node_Property_Filter_Interface::class, true ) ) {
			return new $filter_class();
		}

		return null;
	}
}
