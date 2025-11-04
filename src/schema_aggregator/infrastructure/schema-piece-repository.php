<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Repository_Interface;
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
	 * The meta tags context adapter factory.
	 *
	 * @var Meta_Tags_Context_Memoizer_Adapter
	 */
	private $adapter;

	/**
	 * Constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer         $memoizer             The meta tags context memoizer.
	 * @param Indexable_Helper                   $indexable_helper     The indexable helper.
	 * @param Indexable_Repository               $indexable_repository The indexable repository.
	 * @param Meta_Tags_Context_Memoizer_Adapter $adapter              The adapter factory.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $memoizer,
		Indexable_Helper $indexable_helper,
		Indexable_Repository $indexable_repository,
		Meta_Tags_Context_Memoizer_Adapter $adapter
	) {
		$this->memoizer             = $memoizer;
		$this->indexable_helper     = $indexable_helper;
		$this->indexable_repository = $indexable_repository;
		$this->adapter              = $adapter;
	}

	/**
	 * Gets the indexables to be aggregated.
	 *
	 * @param int $page      The page number (1-based).
	 * @param int $page_size The number of items per page.
	 *
	 * @return array<Schema_Piece> The aggregated schema.
	 */
	public function get( int $page, int $page_size ): array {
		$public_indexables = $this->indexable_repository->find_all_public_paginated(
			$page,
			$page_size,
		);
		$schema_pieces     = [];

		foreach ( $public_indexables as $indexable ) {
			$page_type       = $this->indexable_helper->get_page_type_for_indexable( $indexable );
			$context         = $this->memoizer->get( $indexable, $page_type );
			$context_array   = $this->adapter->meta_tags_context_to_array( $context );
			$schema_pieces[] = new Schema_Piece( $context_array, $page_type );
		}

		return $schema_pieces;
	}
}
