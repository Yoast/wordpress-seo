<?php

namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository_Interface;

/**
 * Default filtering strategy implementation.
 */
class Default_Filter implements Filtering_Strategy_Interface {

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
	 * @param array<Schema_Piece> $schema The schema to be filtered.
	 *
	 * @return array<Schema_Piece> The filtered schema.
	 */
	public function filter( array $schema ): array {
		$elements_context_map = $this->elements_context_map_repository->get_map();
		// Use the map.
		return $schema;
	}
}
