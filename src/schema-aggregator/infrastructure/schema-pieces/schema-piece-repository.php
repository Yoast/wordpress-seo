<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Domain\External_Schema_Piece_Repository_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Repository_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Meta_Tags_Context_Memoizer_Adapter;

/**
 * The Schema_Piece repository.
 */
class Schema_Piece_Repository implements Schema_Piece_Repository_Interface {

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The meta tags context adapter factory.
	 *
	 * @var Meta_Tags_Context_Memoizer_Adapter
	 */
	private $adapter;

	/**
	 * Configuration provider.
	 *
	 * @var Aggregator_Config
	 */
	private $config;

	/**
	 * The schema enhancement factory.
	 *
	 * @var Schema_Enhancement_Factory
	 */
	private $enhancement_factory;

	/**
	 * The indexable repository factory.
	 *
	 * @var Indexable_Repository_Factory
	 */
	private $indexable_repository_factory;

	/**
	 * The WordPress global state adapter.
	 *
	 * @var WordPress_Global_State_Adapter
	 */
	private $global_state_adapter;

	/**
	 * External schema piece repositories.
	 *
	 * @var array<External_Schema_Piece_Repository_Interface>
	 */
	private $external_repositories;

	/**
	 * Constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer                 $memoizer                     The meta tags context memoizer.
	 * @param Indexable_Helper                           $indexable_helper             The indexable helper.
	 * @param Meta_Tags_Context_Memoizer_Adapter         $adapter                      The adapter factory.
	 * @param Aggregator_Config                          $config                       The configuration provider.
	 * @param Schema_Enhancement_Factory                 $enhancement_factory          The schema enhancement factory.
	 * @param Indexable_Repository_Factory               $indexable_repository_factory The indexable repository factory.
	 * @param WordPress_Global_State_Adapter             $global_state_adapter         The global state adapter.
	 * @param External_Schema_Piece_Repository_Interface ...$external_repositories     The external schema piece repositories.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $memoizer,
		Indexable_Helper $indexable_helper,
		Meta_Tags_Context_Memoizer_Adapter $adapter,
		Aggregator_Config $config,
		Schema_Enhancement_Factory $enhancement_factory,
		Indexable_Repository_Factory $indexable_repository_factory,
		WordPress_Global_State_Adapter $global_state_adapter,
		External_Schema_Piece_Repository_Interface ...$external_repositories
	) {
		$this->memoizer                     = $memoizer;
		$this->indexable_helper             = $indexable_helper;
		$this->adapter                      = $adapter;
		$this->config                       = $config;
		$this->enhancement_factory          = $enhancement_factory;
		$this->indexable_repository_factory = $indexable_repository_factory;
		$this->global_state_adapter         = $global_state_adapter;
		$this->external_repositories        = $external_repositories;
	}

	/**
	 * Gets the indexables to be aggregated.
	 *
	 * @param int    $page      The page number (1-based).
	 * @param int    $page_size The number of items per page.
	 * @param string $post_type The post type to filter by.
	 *
	 * @return Schema_Piece_Collection The aggregated schema.
	 */
	public function get( int $page, int $page_size, string $post_type ): Schema_Piece_Collection {
		$indexable_repository = $this->indexable_repository_factory->get_repository( $this->indexable_helper->should_index_indexables() );
		$indexables           = $indexable_repository->get( $page, $page_size, $post_type );
		$schema_pieces        = [];

		foreach ( $indexables as $indexable ) {
			if ( ! \in_array( $indexable->object_sub_type, $this->config->get_allowed_post_types(), true ) ) {
				continue;
			}

			$this->global_state_adapter->set_global_state( $indexable );
			$page_type     = $this->indexable_helper->get_page_type_for_indexable( $indexable );
			$context       = $this->memoizer->get( $indexable, $page_type );
			$context_array = $this->adapter->meta_tags_context_to_array( $context );
			$pieces_data   = $context_array['@graph'];

			// Collect external schema pieces from all supporting repositories.
			$pieces_data = $this->collect_external_schema( $pieces_data, $post_type, $indexable->object_id );

			foreach ( $pieces_data as $piece_data ) {
				$schema_piece = new Schema_Piece( $piece_data, $piece_data['@type'] );
				$enhancer     = $this->enhancement_factory->get_enhancer( $this->get_all_schema_types( $context_array['@graph'] ) );
				if ( $enhancer !== null ) {
					$schema_piece = $enhancer->enhance( $schema_piece, $indexable );
				}
				$schema_pieces[] = $schema_piece;
			}

			$this->global_state_adapter->reset_global_state();
		}

		return new Schema_Piece_Collection( $schema_pieces );
	}

	/**
	 * Collects external schema pieces from all supporting repositories.
	 *
	 * @param array<array<string,string|int|bool|array>> $pieces_data The existing schema pieces.
	 * @param string                                     $post_type   The post type.
	 * @param int                                        $post_id     The post ID.
	 *
	 * @return array<array<string,string|int|bool|array>> The schema pieces with external pieces added.
	 */
	private function collect_external_schema( array $pieces_data, string $post_type, int $post_id ): array {
		foreach ( $this->external_repositories as $repository ) {
			if ( $repository->supports( $post_type ) ) {
				$external_pieces = $repository->collect( $post_id );
				$pieces_data     = \array_merge( $pieces_data, $external_pieces );
			}
		}

		return $pieces_data;
	}

	/**
	 * All schema types present in the schema piece.
	 *
	 * @param array<array<string>> $graph The current graph.
	 *
	 * @return array<string>
	 */
	private function get_all_schema_types( array $graph ): array {
		$schema_types = [];
		foreach ( $graph as $schema_values ) {
			foreach ( $schema_values as $key => $value ) {
				if ( $key === '@type' ) {
					if ( \is_array( $value ) ) {
						foreach ( $value as $type_value ) {
							$schema_types[ $type_value ] = $type_value;
						}
						continue;
					}
					$schema_types[ $value ] = $value;
				}
			}
		}

		return $schema_types;
	}
}
