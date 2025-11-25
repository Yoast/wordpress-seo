<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Application\Meta\Response_Meta_Provider;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Class Schema_Aggregator_Response_Composer
 *
 * Composes the final schema response.
 */
class Schema_Aggregator_Response_Composer {

	/**
	 * The meta provider.
	 *
	 * @var Response_Meta_Provider
	 */
	private $meta_provider;

	/**
	 * Schema_Aggregator_Response_Composer constructor.
	 *
	 * @param Response_Meta_Provider $meta_provider The meta provider.
	 */
	public function __construct( Response_Meta_Provider $meta_provider ) {
		$this->meta_provider = $meta_provider;
	}

	/**
	 * Composes the final schema response.
	 *
	 * @param array<Schema_Piece> $schema_pieces The schema pieces to include in the response.
	 * @param string              $post_type     The post type being queried.
	 * @param int                 $page          The page number (1-based).
	 * @param int                 $page_size     The number of items per page.
	 *
	 * @return array<string> The composed schema response.
	 */
	public function compose( array $schema_pieces, string $post_type, int $page, int $page_size ): array {

		$meta = $this->meta_provider->get_metadata( $post_type, $page, $page_size );
		return [
			'@context' => 'https://schema.org',
			'@graph'   => \array_map(
				static function ( $piece ) {
					return $piece->get_data();
				},
				\array_values( $schema_pieces )
			),
			'meta'     => $meta,
		];
	}
}
