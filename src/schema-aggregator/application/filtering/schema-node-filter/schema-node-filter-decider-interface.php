<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;

/**
 * Schema node filter decider interface.
 */
interface Schema_Node_Filter_Decider_Interface {

	/**
	 * Decides if a schema piece should be filtered.
	 *
	 * @param Schema_Piece_Collection $schema       The full schema.
	 * @param Schema_Piece            $schema_piece The schema piece to be filtered.
	 *
	 * @return bool True if the schema piece should be kept, false otherwise.
	 */
	public function should_filter( Schema_Piece_Collection $schema, Schema_Piece $schema_piece ): bool;
}
