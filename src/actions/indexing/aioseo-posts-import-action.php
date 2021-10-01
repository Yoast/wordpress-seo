<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use wpdb;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * General reindexing action for indexables.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posts_Import_Action implements Indexation_Action_Interface {

	/**
	 * The transient cache key.
	 */
	const UNINDEXED_COUNT_TRANSIENT = 'wpseo_total_unindexed_aioseo_posts';
	const IMPORT_CURSOR_VALUE       = 'wpseo_aioseo_import_cursor';

	/**
	 * Represents the indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	protected $aioseo_to_yoast_map = [
			'title'                  => 'title',
			'description'            => 'description',
			'og_title'       => 'open_graph_title',
			'og_description' => 'open_graph_description',
			'twitter_title'          => 'twitter_title',
			'twitter_description'    => 'twitter_description',
	];

	/**
	 * Indexable_General_Indexation_Action constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexables repository.
	 * @param wpdb                 $wpdb                 The WordPress database instance.
	 */
	public function __construct( Indexable_Repository $indexable_repository, wpdb $wpdb ) {
		$this->indexable_repository = $indexable_repository;
		$this->wpdb                 = $wpdb;
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_total_unindexed() {
		// @TODO: Consider *not* using a transient for this (considering it does not run that frequently).
		$transient = \get_transient( static::UNINDEXED_COUNT_TRANSIENT );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is is already prepared.
		$indexables_to_create = $this->wpdb->get_col( $this->query() );

		$result = \count( $indexables_to_create );

		\set_transient( static::UNINDEXED_COUNT_TRANSIENT, $result, \DAY_IN_SECONDS );

		return $result;
	}

	/**
	 * Creates indexables for unindexed system pages, the date archive, and the homepage.
	 *
	 * @return void
	 */
	public function index() {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is is already prepared.
		$aioseo_indexables = $this->wpdb->get_results( $this->query(), ARRAY_A );

		foreach ( $aioseo_indexables as $aioseo_indexable ) {
			$indexable = $this->indexable_repository->find_by_id_and_type( $aioseo_indexable['post_id'], 'post' );

			// Let's ensure that the current post id represents something that we want to index (eg. *not* shop_order).
			if ( ! \is_a( $indexable, 'Yoast\WP\SEO\Models\Indexable' ) ) {
				continue;
			}
			$indexable = $this->map( $indexable, $aioseo_indexable );

			$indexable->save();
		}
		\update_site_option( static::IMPORT_CURSOR_VALUE, $aioseo_indexable['id'] );
	}

	/**
	 * Creates indexables for unindexed system pages, the date archive, and the homepage.
	 *
	 * @param Indexable $indexable        The Yoast indexable.
	 * @param array     $aioseo_indexable The AIOSEO indexable.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function map( $indexable, $aioseo_indexable ) {
		foreach ( $this->aioseo_to_yoast_map as $prop => $value ) {
			if ( ! empty( $indexable->orm->get( $value ) ) ) {
				continue;
			}

			$indexable->orm->set( $value, $prop);
		}

		return $indexable;
	}

	/**
	 * Returns the number of objects that will be indexed in a single indexing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_aioseo_post_indexation_limit' - Allow filtering the number of posts indexed during each indexing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_aioseo_post_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	/**
	 * Check which indexables already exist and return the values of the ones to create.
	 *
	 * @return array The indexable types to create.
	 */
	private function query() {
		$indexable_table = $this->wpdb->prefix . 'aioseo_posts';

		$cursor = \get_site_option( static::IMPORT_CURSOR_VALUE, 0 );
		$limit  = $this->get_limit();

		$replacements = [ $cursor, $limit ];

		// phpcs:disable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		return $this->wpdb->prepare(
			"
			SELECT *
			FROM {$indexable_table}
			WHERE id > %d
			ORDER BY id
			LIMIT %d",
			$replacements
		);
		// phpcs:enable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}
}
