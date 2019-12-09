<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\Repositories;

use Yoast\WP\Free\Builders\Indexable_Builder;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\ORM\Yoast_Model;
use YoastSEO_Vendor\ORM;

/**
 * Class Indexable_Repository
 *
 * @package Yoast\WP\Free\ORM\Repositories
 */
class Indexable_Repository {

	/**
	 * @var Indexable_Builder
	 */
	private $builder;

	/**
	 * @var \Yoast\WP\Free\Helpers\Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * @var \Psr\Log\LoggerInterface
	 */
	protected $logger;

	/**
	 * @var \wpdb
	 */
	protected $wpdb;

	/**
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @param Indexable_Builder   $builder             The indexable builder.
	 * @param Current_Page_Helper $current_page_helper The current post helper.
	 * @param Logger              $logger              The logger.
	 * @param \wpdb               $wpdb                The WordPress database instance.
	 */
	public function __construct(
		Indexable_Builder $builder,
		Current_Page_Helper $current_page_helper,
		Logger $logger,
		\wpdb $wpdb
	) {
		$this->builder      = $builder;
		$this->current_page = $current_page_helper;
		$this->logger       = $logger;
		$this->wpdb         = $wpdb;
	}

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORMWrapper
	 */
	public function query() {
		return Yoast_Model::of_type( 'Indexable' );
	}

	/**
	 * Attempts to find the indexable for the current WordPress page. Returns false if no indexable could be found.
	 * This may be the result of the indexable not existing or of being unable to determine what type of page the
	 * current page is.
	 *
	 * @return bool|Indexable The indexable, false if none could be found.
	 */
	public function for_current_page() {
		switch ( true ) {
			case $this->current_page->is_simple_page():
				return $this->find_by_id_and_type( $this->current_page->get_simple_page_id(), 'post' );
			case $this->current_page->is_home_static_page():
				return $this->find_by_id_and_type( $this->current_page->get_front_page_id(), 'post' );
			case $this->current_page->is_home_posts_page():
				return $this->find_for_home_page();
			case $this->current_page->is_term_archive():
				return $this->find_by_id_and_type( $this->current_page->get_term_id(), 'term' );
			case $this->current_page->is_date_archive():
				return $this->find_for_date_archive();
			case $this->current_page->is_search_result():
				return $this->find_for_system_page( 'search-result' );
			case $this->current_page->is_post_type_archive():
				return $this->find_for_post_type_archive( $this->current_page->get_queried_post_type() );
			case $this->current_page->is_author_archive():
				return $this->find_by_id_and_type( $this->current_page->get_author_id(), 'user' );
			case $this->current_page->is_404():
				return $this->find_for_system_page( '404' );
		}

		return $this->query()->create( [ 'object_type' => 'unknown' ] );
	}

	/**
	 * Retrieves an indexable by its permalink.
	 *
	 * @param string $permalink The indexable permalink.
	 *
	 * @return bool|Indexable The indexable, false if none could be found.
	 */
	public function find_by_permalink( $permalink ) {
		$permalink      = \trailingslashit( $permalink );
		$permalink_hash = \strlen( $permalink ) . ':' . \md5( $permalink );

		// Find by both permalink_hash and permalink, permalink_hash is indexed so will be used first by the DB to optimize the query.
		return $this->query()
					->where( 'permalink_hash', $permalink_hash )
					->where( 'permalink', $permalink )
					->find_one();
	}

	/**
	 * Retrieves the homepage indexable.
	 *
	 * @param bool $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public function find_for_home_page( $auto_create = true ) {
		/**
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable = $this->query()->where( 'object_type', 'home-page' )->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->builder->build_for_home_page();
		}

		return $indexable;
	}

	/**
	 * Retrieves the date archive indexable.
	 *
	 * @param bool $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|\Yoast\WP\Free\Models\Indexable Instance of indexable.
	 */
	public function find_for_date_archive( $auto_create = true ) {
		/**
		 * Indexable instance.
		 *
		 * @var \Yoast\WP\Free\Models\Indexable $indexable
		 */
		$indexable = $this->query()->where( 'object_type', 'date-archive' )->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->builder->build_for_date_archive();
		}

		return $indexable;
	}

	/**
	 * Retrieves an indexable for a post type archive.
	 *
	 * @param string $post_type   The post type.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable The indexable, false if none could be found.
	 */
	public function find_for_post_type_archive( $post_type, $auto_create = true ) {
		/**
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable = $this->query()
						  ->where( 'object_type', 'post-type-archive' )
						  ->where( 'object_sub_type', $post_type )
						  ->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->builder->build_for_post_type_archive( $post_type );
		}

		return $indexable;
	}

	/**
	 * Retrieves the indexable for a system page.
	 *
	 * @param string $object_sub_type The type of system page.
	 * @param bool   $auto_create     Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public function find_for_system_page( $object_sub_type, $auto_create = true ) {
		/**
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable = $this->query()
						  ->where( 'object_type', 'system-page' )
						  ->where( 'object_sub_type', $object_sub_type )
						  ->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->builder->build_for_system_page( $object_sub_type );
		}

		return $indexable;
	}

	/**
	 * Retrieves an indexable by its ID and type.
	 *
	 * @param int    $object_id   The indexable object ID.
	 * @param string $object_type The indexable object type.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public function find_by_id_and_type( $object_id, $object_type, $auto_create = true ) {
		$indexable = $this->query()
						  ->where( 'object_id', $object_id )
						  ->where( 'object_type', $object_type )
						  ->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->builder->build_for_id_and_type( $object_id, $object_type );
		}

		return $indexable;
	}

	/**
	 * Retrieves multiple indexables at once by their IDs and type.
	 *
	 * @param int[]  $object_ids  The array of indexable object IDs.
	 * @param string $object_type The indexable object type.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return Indexable[] An array of indexables.
	 */
	public function find_by_multiple_ids_and_type( $object_ids, $object_type, $auto_create = true ) {
		$indexables = $this->query()
						   ->where_in( 'object_id', $object_ids )
						   ->where( 'object_type', $object_type )
						   ->find_many();

		if ( $auto_create ) {
			$indexables_available = \array_column( $indexables, 'object_id' );
			$indexables_to_create = \array_diff( $object_ids, $indexables_available );

			foreach ( $indexables_to_create as $indexable_to_create ) {
				$indexable = $this->builder->build_for_id_and_type( $indexable_to_create, $object_type );
				$indexable->save();

				$indexables[] = $indexable;
			}
		}

		return $indexables;
	}

	/**
	 * Returns all ancestors of a given indexable. Optionally prepending a set of static ancestors.
	 *
	 * @param Indexable $indexable              The indexable to find the ancestors of.
	 * @param array     $static_ancestor_wheres Optional. The where conditions by which to find static ancestors.
	 *                                          Should be an array of arrays with the inner arrays containing find
	 *                                          conditions.
	 *
	 * @return Indexable[] All ancestors of the given indexable.
	 */
	public function get_ancestors( Indexable $indexable, $static_ancestor_wheres = [] ) {
		$hierarchy_table = Yoast_Model::get_table_name( 'Indexable_Hierarchy' );
		$ancestor_query  = $this->query()
								->table_alias( 'i' )
								->select( 'i.*' )
								->join( $hierarchy_table, 'i.id = ih.ancestor_id', 'ih' )
								->where( 'ih.indexable_id', $indexable->id )
								->order_by_desc( 'ih.depth' );

		$ancestor_queries = [];
		if ( ! empty( $static_ancestor_wheres ) ) {
			$ancestor_queries = array_map( function ( $where ) {
				return $this->query()->where( $where )->limit( 1 )->find_many();
			}, $static_ancestor_wheres );
		}

		$ancestor_queries[] = $ancestor_query->find_many();

		if ( empty( $ancestor_queries ) ) {
			return [];
		}

		return array_merge( ...$ancestor_queries );
	}

	/**
	 * Retrieves indexables by their IDs.
	 *
	 * @param array $indexable_ids The indexable IDs.
	 *
	 * @return array|\IdiormResultSet Instances of indexables.
	 */
	public function find_by_indexable_ids( array $indexable_ids ) {
		return $this->query()->where_id_in( $indexable_ids )->find_many();
	}

	/**
	 * Creates a query that can find posts with outdated prominent words.
	 *
	 * Why is this method here even though it's internal linking functionality:
	 *
	 * 1. Prominent words are required to determine internal linking suggestions for any indexable.
	 * 2. The prominent words algorithm can be updated to a new version, this version is saved on an indexable.
	 * 3. Outdated posts need to be queried in combination with indexables.
	 * 4. Therefore this method querying both the posts table and the indexables table resides here.
	 *
	 * @param int      $updated_version The version required for posts to be up-to-date.
	 * @param string[] $post_types      The post types to find outdated posts for.
	 *
	 * @return ORM Returns an ORM instance that can be used to execute the query.
	 */
	protected function create_query_for_outdated_prominent_words_posts( $updated_version, $post_types ) {
		$prefix = $this->wpdb->prefix;
		$posts_table = $prefix . 'posts';

		// Because we need it in the subquery we can't do $this->select.
		$indexables_table = Yoast_Model::get_table_name( 'Indexable' );

		$post_statuses = [ 'future', 'draft', 'pending', 'private', 'publish' ];

		// Create a "?" placeholder for every post type to put in the prepared statement.
		$post_types_placeholders = implode( ',', array_fill( 0, count( $post_types ), '?' ) );

		$subquery = <<<QUERY
			SELECT `object_id` FROM {$indexables_table}
			WHERE `prominent_words_version` = ?
			AND `object_type` = 'post'
			AND `object_sub_type` IN ( {$post_types_placeholders} )
QUERY;
		$subquery_values = array_merge( [ $updated_version ], $post_types );

		/*
		 * The subquery selects all indexables that are up-to-date. Using NOT IN we
		 * can then find all posts that are out-of-date.
		 */
		$query = ORM::for_table( $posts_table )
					->select( 'ID' )
					->where_raw( '`ID` NOT IN (' . $subquery . ')', $subquery_values )
					->where_in( 'post_status', $post_statuses )
					->where_in( 'post_type', $post_types );

		return $query;
	}

	/**
	 * Counts posts that have outdated prominent words.
	 *
	 * Uses the above function to create the query because the query is the same as finding posts.
	 * See the above function for more information.
	 *
	 * @param int      $updated_version The version required for posts to be up-to-date.
	 * @param string[] $post_types The post types to count posts for.
	 * @return int The amount of posts that have outdated prominent words.
	 */
	public function count_posts_with_outdated_prominent_words( $updated_version, array $post_types ) {
		// Empty post types would syntax error the query, so early return with no results.
		if ( empty( $post_types ) ) {
			return 0;
		}

		$query = $this->create_query_for_outdated_prominent_words_posts( $updated_version, $post_types );

		return $query->count();
	}

	/**
	 * Finds posts that have outdated prominent words.
	 *
	 * Uses the above function to create the query because the query is the same as counting posts.
	 * See the above function for more information.
	 *
	 * @param int      $updated_version The version required for posts to be up-to-date.
	 * @param string[] $post_types The post types to find posts for.
	 * @param int      $limit      The maximum number of posts to return.
	 * @return int[]               The IDs of the outdated posts.
	 */
	public function find_posts_with_outdated_prominent_words( $updated_version, array $post_types, $limit = 10 ) {
		// Empty post types would syntax error the query, so early return with no results.
		if ( empty( $post_types ) ) {
			return [];
		}

		$query = $this->create_query_for_outdated_prominent_words_posts( $updated_version, $post_types );

		return array_map( function( $result ) {
			return $result['ID'];
		}, $query->limit( $limit )->find_array() );
	}
}
