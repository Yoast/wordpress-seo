<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces;

use EDD\Structured_Data;
use Exception;
use Yoast\WP\SEO\Conditionals\Third_Party\EDD_Conditional;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * The Schema_Piece repository.
 */
class Edd_Schema_Piece_Repository {

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
	 * Collect Product schema for EDD downloads.
	 *
	 * ## How it Works
	 *
	 * Hooks into 'wpseo_schema_product' filter to capture enriched Product schema
	 * Triggers EDD's schema generation
	 * Returns the captured Product entity
	 *
	 * @param int $post_id Download post ID.
	 *
	 * @return array<string,array<string>>|null Product schema entity or null if unavailable.
	 */
	public function collect_download_schema( int $post_id ): ?array {

		if ( ! $this->edd_conditional->is_met() ) {
			return null;
		}

		try {
			$structured_data = new Structured_Data();
			$structured_data->generate_download_data( $post_id );
			$schema_output = $structured_data->get_data();

			if ( ! \is_array( $schema_output ) ) {
				return null;
			}

			if ( ! isset( $schema_output[0]['@id'] ) ) {
				$schema_output[0]['@id'] = $this->meta->for_current_page()->canonical . '#/schema/edd-product/' . \get_the_ID();
			}

			return $schema_output;
		} catch ( Exception $e ) {
			return null;
		}
	}
}
