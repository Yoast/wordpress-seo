<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Article property schema node filter class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Article_Schema_Node_Property_Filter extends Base_Schema_Node_Property_Filter implements Schema_Node_Property_Filter_Interface {

	/**
	 * Filters an article schema piece properties.
	 *
	 * @param Schema_Piece $schema_piece The schema piece to be filtered.
	 *
	 * @return Schema_Piece The filtered schema piece.
	 */
	public function filter_properties( Schema_Piece $schema_piece ): Schema_Piece {
		$filtered_piece = parent::filter_properties( $schema_piece );
		$data           = $filtered_piece->get_data();

		// Remove the article body to reduce schema size.
		if ( isset( $data['mainEntityOfPage'] ) ) {
			unset( $data['mainEntityOfPage'] );
		}

		return new Schema_Piece( $data, $filtered_piece->get_type() );
	}
}
