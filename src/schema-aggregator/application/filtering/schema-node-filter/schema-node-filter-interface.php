<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Schema node filter interface.
 */
interface Schema_Node_Filter_Interface {

	/**
	 * Filters a schema piece.
	 *
	 * @param array<Schema_Piece> $schema       The full schema.
	 * @param Schema_Piece        $schema_piece The schema piece to be filtered.
	 *
	 * @return bool True if the schema piece should be kept, false otherwise.
	 */
	public function filter( array $schema, Schema_Piece $schema_piece ): bool;
}
