<?php

namespace Yoast\WP\SEO\Actions\Importing;

use wpdb;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Importing action for AIOSEO post data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posts_Importing_Action extends Abstract_Importing_Action {

	use Import_Cursor_Manager_Trait;

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'posts';

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
	 * The indexable_to_postmeta helper.
	 *
	 * @var Indexable_To_Postmeta_Helper
	 */
	protected $indexable_to_postmeta;

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
	 * Aioseo_Posts_Import_Action constructor.
	 *
	 * @param Indexable_Repository         $indexable_repository  The indexables repository.
	 * @param wpdb                         $wpdb                  The WordPress database instance.
	 * @param Indexable_To_Postmeta_Helper $indexable_to_postmeta The indexable_to_postmeta helper.
	 * @param Options_Helper               $options               The options helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		wpdb $wpdb,
		Indexable_To_Postmeta_Helper $indexable_to_postmeta,
		Options_Helper $options ) {
		$this->indexable_repository  = $indexable_repository;
		$this->wpdb                  = $wpdb;
		$this->indexable_to_postmeta = $indexable_to_postmeta;
		$this->options               = $options;
	}

	// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared -- Reason: They are already prepared.

	/**
	 * Returns the total number of unimported objects.
	 *
	 * @return int The total number of unimported objects.
	 */
	public function get_total_unindexed() {
		$limit                = false;
		$just_detect          = true;
		$indexables_to_create = $this->wpdb->get_col( $this->query( $limit, $just_detect ) );

		return \count( $indexables_to_create );
	}

	/**
	 * Returns the limited number of unimported objects.
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return int|false The limited number of unindexed posts. False if the query fails.
	 */
	public function get_limited_unindexed_count( $limit ) {
		$just_detect          = true;
		$indexables_to_create = $this->wpdb->get_col( $this->query( $limit, $just_detect ) );

		return \count( $indexables_to_create );
	}

	/**
	 * Imports AIOSEO meta data and creates the respective Yoast indexables and postmeta.
	 *
	 * @return void
	 */
	public function index() {
		$limit             = $this->get_limit();
		$aioseo_indexables = $this->wpdb->get_results( $this->query( $limit ), ARRAY_A );

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
			$this->indexable_to_postmeta->map_to_postmeta( $indexable );

			$last_indexed_aioseo_id = $aioseo_indexable['id'];
		}

		$cursor_id = $this->get_cursor_id();
		$this->set_cursor( $this->options, $cursor_id, $last_indexed_aioseo_id );
	}

	// phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

	/**
	 * Maps AIOSEO meta data to Yoast meta data.
	 *
	 * @param Indexable $indexable        The Yoast indexable.
	 * @param array     $aioseo_indexable The AIOSEO indexable.
	 *
	 * @return Indexable The created indexables.
	 */
	public function map( $indexable, $aioseo_indexable ) {
		// Do not overwrite any existing values.
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
	 * @param int  $limit       The maximum number of unimported objects to be returned.
	 * @param bool $just_detect Whether we want to just detect if there are unimported objects. If false, we want to actually import them too.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	public function query( $limit = false, $just_detect = false ) {
		$indexable_table = $this->wpdb->prefix . 'aioseo_posts';

		$select_statement = 'id';
		if ( ! $just_detect ) {
			// If we want to import too, we need the actual needed data from AIOSEO indexables.
			$needed_data = \array_keys( $this->aioseo_to_yoast_map );
			\array_push( $needed_data, 'id', 'post_id' );

			$select_statement = \implode( ', ', $needed_data );
		}

		$cursor_id    = $this->get_cursor_id();
		$cursor       = $this->get_cursor( $this->options, $cursor_id );
		$replacements = [ $cursor ];

		$limit_statement = '';
		if ( ! empty( $limit ) ) {
			$replacements[]  = $limit;
			$limit_statement = ' LIMIT %d';
		}

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		return $this->wpdb->prepare(
			"SELECT {$select_statement} FROM {$indexable_table} WHERE id > %d ORDER BY id{$limit_statement}",
			$replacements
		);
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}
}
