<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Infrastructure\Actions;

use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The Verify_Term_Indexables_Action class.
 */
class Verify_Term_Indexables_Action implements Verify_Indexables_Action_Interface {

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	private $taxonomy;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * The constructor.
	 *
	 * @param Taxonomy_Helper      $taxonomy   The taxonomy helper.
	 * @param Indexable_Repository $repository The indexable repository.
	 */
	public function __construct( Taxonomy_Helper $taxonomy, Indexable_Repository $repository ) {
		$this->taxonomy   = $taxonomy;
		$this->repository = $repository;
	}

	/**
	 * The wp query.
	 *
	 * @var \wpdb $wpdb
	 */
	private $wpdb;

	/**
	 * Re builds indexables for term indexables.
	 *
	 * @param Last_Batch_Count $last_batch_count The last batch count domain object.
	 * @param Batch_Size       $batch_size       The batch size domain object.
	 *
	 * @return bool
	 */
	public function re_build_indexables( Last_Batch_Count $last_batch_count, Batch_Size $batch_size ): bool {
		$query = $this->get_query( $last_batch_count->get_last_batch(), $batch_size->get_batch_size() );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Function get_select_query returns a prepared query.
		$term_ids = $this->wpdb->get_col( $query );

		foreach ( $term_ids as $term_id ) {
			$this->repository->build_by_id_and_type( (int) $term_id, 'term' );
		}
		return $batch_size->should_keep_going( \count( $term_ids ) );
	}

	/**
	 * Sets the wpdb instance.
	 *
	 * @param \wpdb $wpdb The wpdb instance.
	 *
	 * @return void
	 * @required
	 */
	public function set_wpdb( \wpdb $wpdb ) {
		$this->wpdb = $wpdb;
	}

	/**
	 * Creates the query to get all the taxonomies.
	 *
	 * @param int $limit      The query limit.
	 * @param int $batch_size The batch size for the queries.
	 *
	 * @return string
	 */
	private function get_query( int $limit, int $batch_size ) {
		$taxonomy_table    = $this->wpdb->term_taxonomy;
		$public_taxonomies = $this->taxonomy->get_indexable_taxonomies();
		$replacements      = $public_taxonomies;

		$limit_query    = 'LIMIT %d';
		$replacements[] = $batch_size;
		$offset_query   = '';
		if ( $limit !== 0 ) {
			$offset_query   = ' OFFSET %d';
			$replacements[] = ( $limit + $batch_size );
		}

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		return $this->wpdb->prepare(
			"
			SELECT term_id
			FROM {$taxonomy_table} AS T
			WHERE taxonomy IN (" . \implode( ', ', \array_fill( 0, \count( $public_taxonomies ), '%s' ) ) . ")
			$limit_query $offset_query",
			$replacements
		);
	}
}
