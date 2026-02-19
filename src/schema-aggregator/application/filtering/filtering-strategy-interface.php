<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;

/**
 * Interface for filtering strategies.
 */
interface Filtering_Strategy_Interface {

	/**
	 * Applies filtering to the given schema.
	 *
	 * @param Schema_Piece_Collection $schema The schema to be filtered.
	 *
	 * @return Schema_Piece_Collection The filtered schema.
	 */
	public function filter( Schema_Piece_Collection $schema ): Schema_Piece_Collection;
}
