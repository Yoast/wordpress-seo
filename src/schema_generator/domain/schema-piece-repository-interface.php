<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Schema piece repository interface.
 */
interface Schema_Piece_Repository_Interface {

	/**
	 * Gets schema pieces by indexable IDs.
	 *
	 * @param int $page      The page number.
	 * @param int $page_size The number of items per page.
	 *
	 * @return array<Schema_Piece> The schema pieces.
	 */
	public function get( int $page, int $page_size ): array;
}
