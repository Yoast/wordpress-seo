<?php

namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Interface for filtering strategies.
 */
interface Filtering_Strategy_Interface {

	/**
	 * Applies filtering to the given schema.
	 *
	 * @param array<Schema_Piece> $schema The schema to be filtered.
	 *
	 * @return array<Schema_Piece> The filtered schema.
	 */
	public function filter( array $schema ): array;
}
