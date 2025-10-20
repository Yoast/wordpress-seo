<?php

namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Domain;

use Yoast\WP\SEO\NLWeb\SchemaAggregator\Domain\Schema_Piece;

/**
 * Schema piece repository interface.
 */
interface Schema_Piece_Repository_Interface {

	/**
	 * Gets schema pieces by indexable IDs.
	 *
	 * @param array<int> $indexable_ids The indexable IDs.
	 *
	 * @return array<Schema_Piece> The schema pieces.
	 */
	public function get_by_indexable_ids( array $indexable_ids ): array;
}
