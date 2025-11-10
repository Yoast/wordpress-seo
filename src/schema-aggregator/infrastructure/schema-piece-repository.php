<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Repository_Interface;

/**
 * Repository for Schema_Piece objects.
 */
class Schema_Piece_Repository implements Schema_Piece_Repository_Interface {

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * The indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

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
	 * Constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer         $memoizer             The meta tags context memoizer.
	 * @param Indexable_Helper                   $indexable_helper     The indexable helper.
	 * @param Indexable_Repository               $indexable_repository The indexable repository.
	 * @param Meta_Tags_Context_Memoizer_Adapter $adapter              The adapter factory.
	 * @param Aggregator_Config                  $config               The configuration provider.
	 * @param Schema_Enhancement_Factory         $enhancement_factory  The schema enhancement factory.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $memoizer,
		Indexable_Helper $indexable_helper,
		Indexable_Repository $indexable_repository,
		Meta_Tags_Context_Memoizer_Adapter $adapter,
		Aggregator_Config $config,
		Schema_Enhancement_Factory $enhancement_factory
	) {
		$this->memoizer             = $memoizer;
		$this->indexable_helper     = $indexable_helper;
		$this->indexable_repository = $indexable_repository;
		$this->adapter              = $adapter;
		$this->config               = $config;
		$this->enhancement_factory  = $enhancement_factory;
	}

	/**
	 * Gets the indexables to be aggregated.
	 *
	 * @param int $page      The page number (1-based).
	 * @param int $page_size The number of items per page.
	 *
	 * @return array<Schema_Piece> The aggregated schema.
	 */
	public function get( int $page, int $page_size ): array {
		$public_indexables = $this->indexable_repository->find_all_public_paginated(
			$page,
			$page_size,
		);
		$schema_pieces     = [];

		foreach ( $public_indexables as $indexable ) {
			if ( ! \in_array( $indexable->object_sub_type, $this->config->get_allowed_post_types(), true ) ) {
				continue;
			}
			$page_type     = $this->indexable_helper->get_page_type_for_indexable( $indexable );
			$context       = $this->memoizer->get( $indexable, $page_type );
			$context_array = $this->adapter->meta_tags_context_to_array( $context );
			$pieces_data   = $context_array['@graph'];
			foreach ( $pieces_data as $piece_data ) {
				$schema_piece = new Schema_Piece( $piece_data, $piece_data['@type'] );
				$enhancer     = $this->enhancement_factory->get_enhancer( $this->get_all_schema_types( $context_array['@graph'] ) );
				if ( $enhancer !== null ) {
					$schema_piece = $enhancer->enhance( $schema_piece, $indexable );
				}
				$schema_pieces[] = $schema_piece;
			}
		}

		return $schema_pieces;
	}

	/**
	 * All schema types present in the schema piece.
	 *
	 * @param array<array<string>> $graph The current graph.
	 *
	 * @return array<string>
	 */
	private function get_all_schema_types( $graph ): array {
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
