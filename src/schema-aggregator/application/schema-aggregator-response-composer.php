<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Class Schema_Aggregator_Response_Composer
 *
 * Composes the final schema response.
 */
class Schema_Aggregator_Response_Composer {

	/**
	 * Composes the final schema response.
	 *
	 * @param array<Schema_Piece> $schema_pieces The schema pieces to include in the response.
	 *
	 * @return array<string> The composed schema response.
	 */
	public function compose( array $schema_pieces ): array {
		return [
			'@context' => 'https://schema.org',
			'@graph'   => \array_map(
				static function ( $piece ) {
					return $piece->get_data();
				},
				\array_values( $schema_pieces )
			),
		];
	}
}
