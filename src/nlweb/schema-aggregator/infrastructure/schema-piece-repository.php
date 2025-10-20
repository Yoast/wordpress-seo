<?php

namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\NLWeb\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\NLWeb\Schema_Aggregator\Domain\Schema_Piece_Repository_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Repository for Schema_Piece objects.
 */
class Schema_Piece_Repository implements Schema_Piece_Repository_Interface {

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * The indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The meta tags context converter.
	 *
	 * @var Meta_Tags_Context_Memoizer_Adapter
	 */
	private $context_converter;

	/**
	 * Constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer         $memoizer             The meta tags context memoizer.
	 * @param Indexable_Helper                   $indexable_helper     The indexable helper.
	 * @param Indexable_Repository               $indexable_repository The indexable repository.
	 * @param Meta_Tags_Context_Memoizer_Adapter $context_adapter      The context adapter.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $memoizer,
		Indexable_Helper $indexable_helper,
		Indexable_Repository $indexable_repository,
		Meta_Tags_Context_Memoizer_Adapter $context_adapter
	) {
		$this->memoizer             = $memoizer;
		$this->indexable_helper     = $indexable_helper;
		$this->indexable_repository = $indexable_repository;
		$this->context_converter    = $context_adapter;
	}

	/**
	 * Gets schema pieces for the given indexable IDs.
	 *
	 * @param array<int> $indexable_ids The indexable IDs.
	 * @return array<Schema_Piece> The schema pieces.
	 */
	public function get_by_indexable_ids( array $indexable_ids ): array {
		$indexables = $this->indexable_repository->find_by_ids( $indexable_ids );

		$schema_pieces = [];

		foreach ( $indexables as $indexable ) {
			$page_type       = $this->indexable_helper->get_page_type_for_indexable( $indexable );
			$context         = $this->memoizer->get( $indexable, $page_type );
			$context_array   = $this->context_converter->meta_tags_context_to_array( $context );
			$schema_pieces[] = new Schema_Piece( $context_array, $page_type );
		}

		return $schema_pieces;
	}
}
