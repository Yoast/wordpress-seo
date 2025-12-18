<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;

/**
 * WebPage schema node filter implementation.
 *
 * The class name uses WebPage instead of Webpage because we need it to reflect the schema piece name.
 * By doing so we can search for a piece-specific node filter in Default_Filter.
 */
class WebPage_Schema_Node_Filter implements Schema_Node_Filter_Interface {

	/**
	 * The articles in the schema.
	 *
	 * @var array<string>
	 */
	private $articles_ids;

	/**
	 * Filters a WebPage schema piece if it contains an Article.
	 *
	 * @param Schema_Piece_Collection $schema       The full schema.
	 * @param Schema_Piece            $schema_piece The schema piece to be filtered.
	 *
	 * @return bool True if the schema piece should be kept, false otherwise.
	 */
	public function filter( Schema_Piece_Collection $schema, Schema_Piece $schema_piece ): bool {
		$data         = $schema_piece->get_data();
		$articles_ids = $this->get_articles_ids( $schema );
		foreach ( $articles_ids as $article_id ) {
			if ( \str_contains( $article_id, $data['@id'] ) ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Retrieves the IDs of all Article schema pieces in the schema.
	 *
	 * @param Schema_Piece_Collection $schema The full schema.
	 *
	 * @return array<string> The IDs of the Article schema pieces.
	 */
	private function get_articles_ids( Schema_Piece_Collection $schema ): array {
		if ( ! \is_array( $this->articles_ids ) ) {
			$this->articles_ids = [];
			foreach ( $schema->to_array() as $schema_piece ) {
				if ( $schema_piece->get_type() === 'Article' ) {
					$schema_piece_data    = $schema_piece->get_data();
					$this->articles_ids[] = $schema_piece_data['@id'];
				}
			}
		}
		return $this->articles_ids;
	}
}
