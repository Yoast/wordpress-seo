<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * WebPage property schema node filter class.
 *
 *  The class name uses WebPage instead of Webpage because we need it to reflect the schema piece name.
 *  By doing so we can search for a piece-specific property filter in Default_Filter.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class WebPage_Schema_Node_Property_Filter extends Base_Schema_Node_Property_Filter implements Schema_Node_Property_Filter_Interface {

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
		if ( isset( $data['breadcrumb'] ) ) {
			unset( $data['breadcrumb'] );
		}

		return new Schema_Piece( $data, $filtered_piece->get_type() );
	}
}
