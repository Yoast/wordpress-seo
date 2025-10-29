<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

interface Schema_Enhancement_Interface {


	/**
	 * Enhances the given schema piece.
	 *
	 * @param Schema_Piece $schema_piece The schema piece to enhance.
	 *
	 * @return Schema_Piece The enhanced schema piece.
	 */
	public function enhance( Schema_Piece $schema_piece): Schema_Piece;
}
