<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository_Interface;

/**
 * Default filtering strategy implementation.
 */
class Default_Filter implements Filtering_Strategy_Interface {

	/**
	 * The categories to filter.
	 *
	 * @var array<string>
	 */
	private $filter_categories = [
		'action',
		'enumeration',
		'meta',
		'website',
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
	 * @param Elements_Context_Map_Repository_Interface $elements_context_map_repository The elements-context map repository.
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
			$should_keep = true;
			foreach ( $this->filter_categories as $category ) {
				if ( \in_array( $schema_piece->get_type(), $elements_context_map[ $category ], true ) ) {
					$filter_class_name = 'Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\\' . $schema_piece->get_type() . '_Schema_Node_Filter';
					if ( \class_exists( $filter_class_name ) && \is_a( $filter_class_name, 'Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter\Schema_Node_Filter_Interface', true ) ) {
						$should_keep = ( new $filter_class_name() )->filter( $schema, $schema_piece );
					}
					else {
						$should_keep = false;
					}
					break;
				}
			}
			if ( $should_keep ) {
				$properties_filter_class_name = 'Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\\' . $schema_piece->get_type() . '_Schema_Node_Property_Filter';
				if ( \class_exists( $properties_filter_class_name ) && \is_a( $properties_filter_class_name, 'Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter\Schema_Node_Property_Filter_Interface', true ) ) {
					$schema_piece = ( new $properties_filter_class_name() )->filter_properties( $schema_piece );
				}
				$filtered_schema[] = $schema_piece;
			}
		}
		return new Schema_Piece_Collection( $filtered_schema );
	}
}
