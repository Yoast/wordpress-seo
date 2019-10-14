<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\Repositories;

use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\Free\Builders\Indexable_Post_Builder;
use Yoast\WP\Free\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\Free\Builders\Indexable_System_Page_Builder;
use Yoast\WP\Free\Builders\Indexable_Term_Builder;
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
	 * @var Indexable_Author_Builder
	 */
	protected $author_builder;

	/**
	 * @var Indexable_Post_Builder
	 */
	protected $post_builder;

	/**
	 * @var Indexable_Term_Builder
	 */
	protected $term_builder;

	/**
	 * @var Indexable_Home_Page_Builder
	 */
	protected $home_page_builder;

	/**
	 * @var Indexable_Post_Type_Archive_Builder
	 */
	private $post_type_archive_builder;

	/**
	 * @var Indexable_System_Page_Builder
	 */
	private $system_page_builder;

	/**
	 * @var Current_Page_Helper
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
	 * @param Indexable_Author_Builder            $author_builder            The author builder for creating missing indexables.
	 * @param Indexable_Post_Builder              $post_builder              The post builder for creating missing indexables.
	 * @param Indexable_Term_Builder              $term_builder              The term builder for creating missing indexables.
	 * @param Indexable_Home_Page_Builder         $home_page_builder         The front page builder for creating missing indexables.
	 * @param Indexable_Post_Type_Archive_Builder $post_type_archive_builder The post type archive builder for creating missing indexables.
	 * @param Indexable_System_Page_Builder       $system_page_builder       The search result builder for creating missing indexables.
	 * @param Current_Page_Helper                 $current_page_helper       The current post helper.
	 * @param Logger                              $logger                    The logger.
	 * @param \wpdb                               $wpdb                      The WordPress database instance.
	 */
	public function __construct(
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Indexable_Home_Page_Builder $home_page_builder,
		Indexable_Post_Type_Archive_Builder $post_type_archive_builder,
		Indexable_System_Page_Builder $system_page_builder,
		Current_Page_Helper $current_page_helper,
		Logger $logger,
		\wpdb $wpdb
	) {
		$this->author_builder            = $author_builder;
		$this->post_builder              = $post_builder;
		$this->term_builder              = $term_builder;
		$this->home_page_builder         = $home_page_builder;
		$this->post_type_archive_builder = $post_type_archive_builder;
		$this->system_page_builder       = $system_page_builder;
		$this->current_page              = $current_page_helper;
		$this->logger                    = $logger;
		$this->wpdb                      = $wpdb;
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
			case $this->current_page->is_search_result():
				return $this->find_for_system_page( 'search-result' );
			case $this->current_page->is_post_type_archive():
				return $this->find_for_post_type_archive( $this->current_page->get_queried_post_type() );
			case $this->current_page->is_404():
				return $this->find_for_system_page( '404' );
		}

		return $this->query()->create( [ 'object_type' => 'unknown' ] );
	}

	/**
	 * Retrieves an indexable by it's URL.
	 *
	 * @param string $url The indexable url.
	 *
	 * @return bool|Indexable The indexable, false if none could be found.
	 */
	public function find_by_url( $url ) {
		$url      = \trailingslashit( $url );
		$url_hash = \strlen( $url ) . ':' . \md5( $url );

		// Find by both url_hash and url, url_hash is indexed so will be used first by the DB to optimize the query.
		return $this->query()
					->where( 'url_hash', $url_hash )
					->where( 'url', $url )
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
			$indexable = $this->create_for_home_page();
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
			$indexable = $this->create_for_post_type_archive( $post_type );
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
			$indexable = $this->create_for_system_page( $object_sub_type );
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
			$indexable = $this->create_for_id_and_type( $object_id, $object_type );
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
				$indexable = $this->create_for_id_and_type( $indexable_to_create, $object_type );
				$indexable->save();

				$indexables[] = $indexable;
			}
		}

		return $indexables;
	}

	/**
	 * Creates an indexable by its ID and type.
	 *
	 * @param int    $object_id   The indexable object ID.
	 * @param string $object_type The indexable object type.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public function create_for_id_and_type( $object_id, $object_type ) {
		/**
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable = $this->query()->create();

		switch ( $object_type ) {
			case 'post':
				$indexable = $this->post_builder->build( $object_id, $indexable );
				break;
			case 'user':
				$indexable = $this->author_builder->build( $object_id, $indexable );
				break;
			case 'term':
				$indexable = $this->term_builder->build( $object_id, $indexable );
				break;
		}

		$this->logger->debug(
			\sprintf(
				/* translators: 1: object ID; 2: object type. */
				\__( 'Indexable created for object %1$s with type %2$s', 'wordpress-seo' ),
				$object_id,
				$object_type
			),
			\get_object_vars( $indexable )
		);

		$indexable->save();
		return $indexable;
	}

	/**
	 * Creates an indexable for the homepage.
	 *
	 * @return Indexable The home page indexable.
	 */
	public function create_for_home_page() {
		$indexable = $this->query()->create();
		$indexable = $this->home_page_builder->build( $indexable );

		$indexable->save();
		return $indexable;
	}

	/**
	 * Creates an indexable for a post type archive.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return Indexable The post type archive indexable.
	 */
	public function create_for_post_type_archive( $post_type ) {
		$indexable = $this->query()->create();
		$indexable = $this->post_type_archive_builder->build( $post_type, $indexable );

		$indexable->save();
		return $indexable;
	}

	/**
	 * Creates an indexable for a system page.
	 *
	 * @param string $object_sub_type The type of system page.
	 *
	 * @return Indexable The search result indexable.
	 */
	public function create_for_system_page( $object_sub_type ) {
		$indexable = $this->query()->create();
		$indexable = $this->system_page_builder->build( $object_sub_type, $indexable );

		$indexable->save();
		return $indexable;
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

		$post_statuses = array( 'future', 'draft', 'pending', 'private', 'publish' );

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
