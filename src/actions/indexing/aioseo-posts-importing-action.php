<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use wpdb;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Importing action for AIOSEO post data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posts_Importing_Action extends Abstract_Importing_Action {

	use Cursor_Manager_Trait;

	/**
	 * The domain of the action.
	 */
	const DOMAIN = 'aioseo';

	/**
	 * The name of the action.
	 */
	const NAME = 'posts';

	/**
	 * The map of yoast to post meta.
	 *
	 * @var string
	 */
	private $cursor_id = self::DOMAIN . '_' . self::NAME;

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
	 * The Meta helper.
	 *
	 * @var Meta_Helper
	 */
	protected $meta;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The map of aioseo to yoast meta.
	 *
	 * @var array
	 */
	protected $aioseo_to_yoast_map = [
		'title'               => 'title',
		'description'         => 'description',
		'og_title'            => 'open_graph_title',
		'og_description'      => 'open_graph_description',
		'twitter_title'       => 'twitter_title',
		'twitter_description' => 'twitter_description',
	];

	/**
	 * The map of yoast to post meta.
	 *
	 * @var array
	 */
	protected $yoast_to_postmeta = [
		'title'                  => 'title',
		'description'            => 'metadesc',
		'open_graph_title'       => 'opengraph-title',
		'open_graph_description' => 'opengraph-description',
		'twitter_title'          => 'twitter-title',
		'twitter_description'    => 'twitter-description',
	];

	/**
	 * Aioseo_Posts_Import_Action constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexables repository.
	 * @param wpdb                 $wpdb                 The WordPress database instance.
	 * @param Meta_Helper          $meta                 The Meta helper.
	 * @param Options_Helper       $options              The options helper.
	 */
	public function __construct( Indexable_Repository $indexable_repository, wpdb $wpdb, Meta_Helper $meta, Options_Helper $options ) {
		$this->indexable_repository = $indexable_repository;
		$this->wpdb                 = $wpdb;
		$this->meta                 = $meta;
		$this->options              = $options;
	}

	/**
	 * Returns the (limited) total number of unimported objects.
	 *
	 * @return int The (limited) total number of unimported objects.
	 */
	public function get_total_unindexed() {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is is already prepared.
		$indexables_to_create = $this->wpdb->get_col( $this->query() );

		return \count( $indexables_to_create );
	}

	/**
	 * Returns a limited number of unindexed posts.
	 *
	 * @param int $limit Limit the maximum number of unindexed posts that are counted.
	 *
	 * @return int|false The limited number of unindexed posts. False if the query fails.
	 */
	public function get_limited_unindexed_count( $limit ) {
		return $this->get_total_unindexed();
	}

	/**
	 * Imports AIOSEO meta data and creates the respective Yoast indexables and postmeta.
	 *
	 * @return void
	 */
	public function index() {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is is already prepared.
		$aioseo_indexables = $this->wpdb->get_results( $this->query(), ARRAY_A );

		$last_indexed_aioseo_id = 0;
		foreach ( $aioseo_indexables as $aioseo_indexable ) {
			$indexable = $this->indexable_repository->find_by_id_and_type( $aioseo_indexable['post_id'], 'post' );

			// Let's ensure that the current post id represents something that we want to index (eg. *not* shop_order).
			if ( ! \is_a( $indexable, 'Yoast\WP\SEO\Models\Indexable' ) ) {
				continue;
			}

			$indexable = $this->map( $indexable, $aioseo_indexable );
			$indexable->save();

			// To ensure that indexables can be rebuild after a reset, we have to store the data in the postmeta table too.
			$this->map_to_postmeta( $indexable );

			$last_indexed_aioseo_id = $aioseo_indexable['id'];
		}

		$this->set_cursor( $this->options, $last_indexed_aioseo_id );
	}

	/**
	 * Maps AIOSEO meta data to Yoast meta data.
	 *
	 * @param Indexable $indexable        The Yoast indexable.
	 * @param array     $aioseo_indexable The AIOSEO indexable.
	 *
	 * @return Indexable The created indexables.
	 */
	public function map( $indexable, $aioseo_indexable ) {
		foreach ( $this->aioseo_to_yoast_map as $aioseo_key => $yoast_key ) {
			if ( ! empty( $indexable->{$yoast_key} ) ) {
				continue;
			}

			if ( ! empty( $aioseo_indexable[ $aioseo_key ] ) ) {
				$indexable->{$yoast_key} = $aioseo_indexable[ $aioseo_key ];
			}
		}

		return $indexable;
	}

	/**
	 * Creates postmeta from a Yoast indexable.
	 *
	 * @param Indexable $indexable The Yoast indexable.
	 *
	 * @return void.
	 */
	public function map_to_postmeta( $indexable ) {
		foreach ( $this->yoast_to_postmeta as $indexable_column => $post_meta_key ) {
			if ( empty( $indexable->{$indexable_column} ) ) {
				continue;
			}

			$this->meta->set_value( $post_meta_key, $indexable->{$indexable_column}, $indexable->object_id );
		}
	}

	/**
	 * Returns the number of objects that will be imported in a single importing pass.
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
	 * Creates a query for gathering AiOSEO data from the database.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	public function query() {
		$indexable_table = $this->wpdb->prefix . 'aioseo_posts';

		$cursor = $this->get_cursor( $this->options );
		$limit  = $this->get_limit();

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		return $this->wpdb->prepare(
			"SELECT * FROM {$indexable_table} WHERE id > %d ORDER BY id LIMIT %d",
			$cursor,
			$limit
		);
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}
}
