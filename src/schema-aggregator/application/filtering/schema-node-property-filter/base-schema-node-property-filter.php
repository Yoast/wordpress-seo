<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Property_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Base property schema node filter class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Base_Schema_Node_Property_Filter implements Schema_Node_Property_Filter_Interface {
	/**
	 * The default properties to avoid in schema pieces.
	 *
	 * @var array<string>
	 */
	private const PROPERTIES_AVOID_LIST = [ 'potentialAction', 'isPartOf', 'mainEntityOfPage', 'primaryImageOfPage' ];

	/**
	 * Filters any schema piece properties.
	 *
	 * @param Schema_Piece $schema_piece The schema piece to be filtered.
	 *
	 * @return Schema_Piece The filtered schema piece.
	 */
	public function filter_properties( Schema_Piece $schema_piece ): Schema_Piece {
		$data = $schema_piece->get_data();

		foreach ( $this->get_properties_avoid_list() as $property ) {
			if ( \array_key_exists( $property, $data ) ) {
				unset( $data[ $property ] );
			}
		}

		return new Schema_Piece( $data, $schema_piece->get_type() );
	}

	/**
	 * Gets the properties avoid list.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array<string> The properties avoid list.
	 */
	private function get_properties_avoid_list(): array {
		return self::PROPERTIES_AVOID_LIST;
	}
}
