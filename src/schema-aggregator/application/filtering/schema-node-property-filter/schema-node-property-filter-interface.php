<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Property schema node filter interface.
 */
interface Schema_Node_Property_Filter_Interface {

	/**
	 * Filters a schema piece properties.
	 *
	 * @param Schema_Piece $schema_piece The schema piece to be filtered.
	 *
	 * @return Schema_Piece The filtered schema piece.
	 */
	public function filter_properties( Schema_Piece $schema_piece ): Schema_Piece;
}
