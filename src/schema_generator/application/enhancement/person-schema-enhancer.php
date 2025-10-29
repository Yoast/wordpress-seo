<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Enhancement\Schema_Enhancement_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

class Person_Schema_Enhancer implements Schema_Enhancement_Interface {

	/**
	 * Enhances specific Person schema pieces.
	 * @param Schema_Piece $schema_piece The schema piece to enhance.
	 * @return Schema_Piece The enhanced schema piece.
	 *
	 */
	public function enhance( Schema_Piece $schema_piece ): Schema_Piece {
		// TODO: Implement enhance() method.
	}


}
