<?php
/**
 * Reindexation action for indexables.
 *
 * @package Yoast\WP\SEO\Actions\Indexation
 */

namespace Yoast\WP\SEO\Actions\Indexation;

use wpdb;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Indexable_Term_Indexation_Action class.
 */
class Indexable_Term_Indexation_Action implements Indexation_Action_Interface {

	/**
	 * The post type helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy;

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
	 * Indexable_Term_Indexation_Action constructor
	 *
	 * @param Taxonomy_Helper      $taxonomy   The taxonomy helper.
	 * @param Indexable_Repository $repository The indexable repository.
	 * @param wpdb                 $wpdb       The WordPress database instance.
	 */
	public function __construct( Taxonomy_Helper $taxonomy, Indexable_Repository $repository, wpdb $wpdb ) {
		$this->taxonomy   = $taxonomy;
		$this->repository = $repository;
		$this->wpdb       = $wpdb;
	}

	/**
	 * The total number of unindexed terms.
	 *
	 * @return int|false The amount of unindexed terms. False if the query fails.
	 */
	public function get_total_unindexed() {
		$query = $this->get_query( true );

		$result = $this->wpdb->get_var( $query );

		if ( \is_null( $result ) ) {
			return false;
		}

		return (int) $result;
	}

	/**
	 * Creates indexables for unindexed terms.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function index() {
		$query    = $this->get_query( false, $this->get_limit() );
		$term_ids = $this->wpdb->get_col( $query );

		$indexables = [];
		foreach ( $term_ids as $term_id ) {
			$indexables[] = $this->repository->find_by_id_and_type( (int) $term_id, 'term' );
		}

		return $indexables;
	}

	/**
	 * @inheritDoc
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_term_indexation_limit' - Allow filtering the amount of terms indexed during each indexing pass.
		 *
		 * @api int The maximum number of terms indexed.
		 */
		$limit = \apply_filters( 'wpseo_term_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
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
		$public_taxonomies = $this->taxonomy->get_public_taxonomies();
		$placeholders      = \implode( ', ', \array_fill( 0, \count( $public_taxonomies ), '%s' ) );
		$indexable_table   = Model::get_table_name( 'Indexable' );
		$replacements      = $public_taxonomies;

		$select = 'term_id';
		if ( $count ) {
			$select = 'COUNT(term_id)';
		}
		$limit_query = '';
		if ( ! $count ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $limit;
		}

		return $this->wpdb->prepare(
			"
			SELECT $select
			FROM {$this->wpdb->term_taxonomy}
			WHERE term_id NOT IN (SELECT object_id FROM $indexable_table WHERE object_type = 'term') AND taxonomy IN ($placeholders)
			$limit_query",
			$replacements
		);
	}
}
