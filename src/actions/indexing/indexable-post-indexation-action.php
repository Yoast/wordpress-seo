<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Reindexing action for post indexables.
 */
class Indexable_Post_Indexation_Action implements Indexation_Action_Interface {

	/**
	 * The transient cache key.
	 */
	const TRANSIENT_CACHE_KEY = 'wpseo_total_unindexed_posts';

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

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
	 * @param Post_Type_Helper     $post_type_helper The post type helper.
	 * @param Indexable_Repository $repository       The indexable repository.
	 * @param wpdb                 $wpdb             The WordPress database instance.
	 */
	public function __construct( Post_Type_Helper $post_type_helper, Indexable_Repository $repository, wpdb $wpdb ) {
		$this->post_type_helper = $post_type_helper;
		$this->repository       = $repository;
		$this->wpdb             = $wpdb;
	}

	/**
	 * Returns the total number of unindexed posts.
	 *
	 * @return int|false The total number of unindexed posts. False if the query fails.
	 */
	public function get_total_unindexed() {
		$transient = \get_transient( static::TRANSIENT_CACHE_KEY );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		$query = $this->get_query( true );

		$result = $this->wpdb->get_var( $query );

		if ( \is_null( $result ) ) {
			return false;
		}

		\set_transient( static::TRANSIENT_CACHE_KEY, $result, \DAY_IN_SECONDS );

		return (int) $result;
	}

	/**
	 * Creates indexables for unindexed posts.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function index() {
		$query    = $this->get_query( false, $this->get_limit() );
		$post_ids = $this->wpdb->get_col( $query );

		$indexables = [];
		foreach ( $post_ids as $post_id ) {
			$indexables[] = $this->repository->find_by_id_and_type( (int) $post_id, 'post' );
		}

		\delete_transient( static::TRANSIENT_CACHE_KEY );

		return $indexables;
	}

	/**
	 * Returns the number of posts that will be indexed in a single indexing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_post_indexation_limit' - Allow filtering the amount of posts indexed during each indexing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_post_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	/**
	 * Queries the database for unindexed post IDs.
	 *
	 * @param bool $count Whether or not it should be a count query.
	 * @param int  $limit The maximum number of post IDs to return.
	 *
	 * @return string The query.
	 */
	protected function get_query( $count, $limit = 1 ) {
		$indexable_table = Model::get_table_name( 'Indexable' );
		$post_types      = $this->get_post_types();
		$replacements    = $post_types;

		$select = 'ID';
		if ( $count ) {
			$select = 'COUNT(ID)';
		}
		$limit_query = '';
		if ( ! $count ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $limit;
		}

		return $this->wpdb->prepare(
			"
			SELECT $select
			FROM {$this->wpdb->posts}
			WHERE ID NOT IN (
				SELECT object_id
				FROM $indexable_table
				WHERE object_type = 'post'
				AND permalink_hash IS NOT NULL
			)
			AND post_type IN (" . \implode( ', ', \array_fill( 0, \count( $post_types ), '%s' ) ) . ")
			$limit_query",
			$replacements
		);
	}

	/**
	 * Returns the post types that should be indexed.
	 *
	 * @return array The post types that should be indexed.
	 */
	protected function get_post_types() {
		$public_post_types   = $this->post_type_helper->get_public_post_types();
		$excluded_post_types = $this->post_type_helper->get_excluded_post_types_for_indexables();

		// `array_values`, to make sure that the keys are reset.
		return \array_values( \array_diff( $public_post_types, $excluded_post_types ) );
	}
}
