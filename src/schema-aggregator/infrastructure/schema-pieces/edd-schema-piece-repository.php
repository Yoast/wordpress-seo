<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces;

use EDD\Structured_Data;
use Exception;
use Yoast\WP\SEO\Conditionals\Third_Party\EDD_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Domain\External_Schema_Piece_Repository_Interface;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * The EDD schema piece repository.
 */
class Edd_Schema_Piece_Repository implements External_Schema_Piece_Repository_Interface {

	/**
	 * The EDD Conditional.
	 *
	 * @var EDD_Conditional
	 */
	private $edd_conditional;

	/**
	 * The Meta Surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta;

	/**
	 * Edd_Schema_Piece_Repository constructor.
	 *
	 * @param EDD_Conditional $edd_conditional The EDD Conditional.
	 * @param Meta_Surface    $meta            The Meta Surface.
	 */
	public function __construct( EDD_Conditional $edd_conditional, Meta_Surface $meta ) {
		$this->edd_conditional = $edd_conditional;
		$this->meta            = $meta;
	}

	/**
	 * Checks if this repository supports the given post type.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool True if this repository can provide schema for the post type.
	 */
	public function supports( string $post_type ): bool {
		return $this->edd_conditional->is_met() && $post_type === 'download';
	}

	/**
	 * Collects download schema pieces for EDD downloads.
	 *
	 * Triggers EDD's schema generation.
	 * Returns the captured Product entity.
	 *
	 * @param int $post_id Download post ID.
	 *
	 * @return array<array<string,string|int|bool|array>> Product schema pieces (empty array if unavailable).
	 */
	public function collect( int $post_id ): array {
		if ( ! $this->edd_conditional->is_met() ) {
			return [];
		}

		try {
			$structured_data = new Structured_Data();
			$structured_data->generate_download_data( $post_id );
			$schema_output = $structured_data->get_data();

			if ( ! \is_array( $schema_output ) || empty( $schema_output ) ) {
				return [];
			}

			// Ensure each piece has an @id.
			foreach ( $schema_output as $key => $piece ) {
				if ( ! isset( $piece['@id'] ) ) {
					$schema_output[ $key ]['@id'] = $this->meta->for_post( $post_id )->canonical . '#/schema/edd-product/' . $post_id;
				}
			}

			return $schema_output;
		} catch ( Exception $e ) {
			return [];
		}
	}
}
