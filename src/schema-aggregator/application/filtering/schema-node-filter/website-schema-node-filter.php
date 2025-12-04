<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * WebSite schema node filter implementation.
 */
class WebSite_Schema_Node_Filter implements Schema_Node_Filter_Interface {

	/**
	 * Filters a WebSite schema piece if it matches the site's URL.
	 *
	 * @param array<Schema_Piece> $schema       The full schema.
	 * @param Schema_Piece        $schema_piece The schema piece to be filtered.
	 *
	 * @return bool True if the schema piece should be kept, false otherwise.
	 */
	public function filter( array $schema, Schema_Piece $schema_piece ): bool {
		// Shall we support multisite here?
		$blog_id  = \get_current_blog_id();
		$blog_url = \trailingslashit( \get_home_url( $blog_id ) );
		$data     = $schema_piece->get_data();
		if ( $data['url'] === $blog_url ) {
			return false;
		}
		return true;
	}
}
