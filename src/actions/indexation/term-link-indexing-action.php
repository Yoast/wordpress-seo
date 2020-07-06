<?php
/**
 * Reindexation action for indexables.
 *
 * @package Yoast\WP\SEO\Actions\Indexation
 */

namespace Yoast\WP\SEO\Actions\Indexation;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Term_Link_Indexing_Action class.
 */
class Term_Link_Indexing_Action implements Indexation_Action_Interface {

	/**
	 * The transient name.
	 *
	 * @var string
	 */
	const TRANSIENT = 'wpseo-unindexed-term-link-count';

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The post type helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * Indexable_Post_Indexing_Action constructor
	 *
	 * @param Indexable_Link_Builder $link_builder     The indexable link builder.
	 * @param Taxonomy_Helper        $taxonomy_helper  The taxonomy helper.
	 * @param Indexable_Repository   $repository       The indexable repository.
	 * @param wpdb                   $wpdb             The WordPress database instance.
	 */
	public function __construct(
		Indexable_Link_Builder $link_builder,
		Taxonomy_Helper $taxonomy_helper,
		Indexable_Repository $repository,
		wpdb $wpdb
	) {
		$this->link_builder    = $link_builder;
		$this->taxonomy_helper = $taxonomy_helper;
		$this->repository      = $repository;
		$this->wpdb            = $wpdb;
	}

	/**
	 * @inheritDoc
	 */
	public function get_total_unindexed() {
		$transient = \get_transient( self::TRANSIENT );

		if ( $transient ) {
			return (int) $transient;
		}

		$query = $this->get_query( true );

		$result = $this->wpdb->get_var( $query );

		if ( \is_null( $result ) ) {
			return false;
		}

		\set_transient( self::TRANSIENT, $result, \DAY_IN_SECONDS );

		return (int) $result;
	}

	/**
	 * Creates indexables for unindexed posts.
	 *
	 * @return SEO_Links[] The created SEO links.
	 */
	public function index() {
		$query = $this->get_query( false, $this->get_limit() );

		$terms = $this->wpdb->get_results( $query );

		$indexables = [];
		foreach ( $terms as $term ) {
			$indexable = $this->repository->find_by_id_and_type( (int) $term->term_id, 'term' );

			// It's possible the indexable was created without having it's links indexed.
			if ( $indexable->link_count === null ) {
				$this->link_builder->build( $indexable, $term->description );
			}

			$indexables[] = $indexable;
		}

		\delete_transient( self::TRANSIENT );

		return $indexables;
	}

	/**
	 * @inheritDoc
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_term_link_indexing_limit' - Allow filtering the amount of terms indexed during each indexing pass.
		 *
		 * @api int The maximum number of terms indexed.
		 */
		return \apply_filters( 'wpseo_term_link_indexing_limit', 5 );
	}

	/**
	 * Queries the database for unindexed term IDs.
	 *
	 * @param bool $count Whether or not it should be a count query.
	 * @param int  $limit The maximum amount of term IDs to return.
	 *
	 * @return string The query.
	 */
	protected function get_query( $count, $limit = 1 ) {
		$public_taxonomies = $this->taxonomy_helper->get_public_taxonomies();
		$placeholders      = \implode( ', ', \array_fill( 0, \count( $public_taxonomies ), '%s' ) );
		$indexable_table   = Model::get_table_name( 'Indexable' );
		$replacements      = $public_taxonomies;

		$select = 'term_id, description';
		if ( $count ) {
			$select = 'COUNT(term_id)';
		}
		$limit_query = '';
		if ( ! $count ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $limit;
		}

		return $this->wpdb->prepare( "
			SELECT $select
			FROM {$this->wpdb->term_taxonomy}
			WHERE term_id NOT IN (SELECT object_id FROM $indexable_table WHERE link_count IS NOT NULL) AND taxonomy IN ($placeholders)
			$limit_query
		", $replacements );
	}
}
