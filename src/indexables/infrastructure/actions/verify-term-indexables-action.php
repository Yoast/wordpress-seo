<?php

namespace Yoast\WP\SEO\Indexables\Infrastructure\Actions;

use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

class Verify_Term_Indexables_Action implements Verify_Indexables_Action_Interface {

	/**
	 * @var \Yoast\WP\SEO\Helpers\Taxonomy_Helper
	 */
	protected $taxonomy;

	/**
	 * @var \Yoast\WP\SEO\Repositories\Indexable_Repository
	 */
	protected $repository;

	public function __construct( Taxonomy_Helper $taxonomy, Indexable_Repository $repository ) {
		$this->taxonomy   = $taxonomy;
		$this->repository = $repository;
	}

	/**
	 * @var \wpdb $wpdb The wp query.
	 */
	private $wpdb;

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
	 * @param \wpdb $wpdb
	 *
	 * @return void
	 * @required
	 */
	public function set_wpdb( \wpdb $wpdb ) {
		$this->wpdb = $wpdb;
	}

	private function get_query( $limit, $batch_size ) {
		$taxonomy_table    = $this->wpdb->term_taxonomy;
		$public_taxonomies = $this->taxonomy->get_indexable_taxonomies();
		$placeholders      = \implode( ', ', \array_fill( 0, \count( $public_taxonomies ), '%s' ) );

		$replacements = [];
		\array_push( $replacements, ...$public_taxonomies );


		$limit_query    = 'LIMIT %d';
		$replacements[] = $batch_size ;
		$offset_query = '';
		if($limit !== 0){
		$offset_query   = 'OFFSET %d';
		$replacements[] = ( $limit + $batch_size );}

		return $this->wpdb->prepare(
			"
			SELECT term_id
			FROM {$taxonomy_table} AS T
			WHERE taxonomy IN ($placeholders)
			$limit_query $offset_query",
			$replacements
		);
	}
}
