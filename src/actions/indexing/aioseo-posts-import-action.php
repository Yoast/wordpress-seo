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
		$transient = \get_transient( static::UNINDEXED_COUNT_TRANSIENT );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		$indexables_to_create = $this->wpdb->get_col( $this->query() );

		$result = \count( $indexables_to_create );

		\set_transient( static::UNINDEXED_COUNT_TRANSIENT, $result, \DAY_IN_SECONDS );

		return $result;
	}

	/**
	 * Creates indexables for unindexed system pages, the date archive, and the homepage.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function index() {
		//@TODO
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
		
		// @phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber
		return $this->wpdb->prepare(
			"
			SELECT post_id
			FROM {$indexable_table}
			WHERE id > %d
			ORDER BY id
			LIMIT %d",
			$replacements
		);
	}
}
