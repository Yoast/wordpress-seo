<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;

/**
 * Class Schema_Aggregator_Response_Composer
 *
 * Composes the final schema response.
 */
class Schema_Aggregator_Response_Composer {

	/**
	 * Composes the final schema response.
	 *
	 * @param Schema_Piece_Collection $schema_pieces The schema pieces to include in the response.
	 *
	 * @return array<string> The composed schema response.
	 */
	public function compose( Schema_Piece_Collection $schema_pieces ): array {
		$composed_pieces = [];
		foreach ( $schema_pieces->to_array() as $piece ) {
			$composed_pieces[] = \array_merge(
				[
					'@context' => 'https://schema.org',
				],
				$piece->get_data()
			);
		}

		return $composed_pieces;
	}
}
