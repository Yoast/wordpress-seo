<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\Repositories;

use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Builders\Indexable_Date_Archive_Builder;
use Yoast\WP\Free\Builders\Indexable_Home_Page_Builder;
use Yoast\WP\Free\Builders\Indexable_Post_Builder;
use Yoast\WP\Free\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\Free\Builders\Indexable_Search_Result_Builder;
use Yoast\WP\Free\Builders\Indexable_Term_Builder;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Class Indexable_Repository
 *
 * @package Yoast\WP\Free\ORM\Repositories
 */
class Indexable_Repository {

	/**
	 * @var \Yoast\WP\Free\Builders\Indexable_Author_Builder
	 */
	protected $author_builder;

	/**
	 * @var \Yoast\WP\Free\Builders\Indexable_Post_Builder
	 */
	protected $post_builder;

	/**
	 * @var \Yoast\WP\Free\Builders\Indexable_Term_Builder
	 */
	protected $term_builder;

	/**
	 * @var \Yoast\WP\Free\Builders\Indexable_Home_Page_Builder
	 */
	protected $home_page_builder;

	/**
	 * @var Indexable_Post_Type_Archive_Builder
	 */
	private $post_type_archive_builder;

	/**
	 * @var Indexable_Search_Result_Builder
	 */
	private $search_result_builder;

	/**
	 * @var \Yoast\WP\Free\Helpers\Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * @var \Psr\Log\LoggerInterface
	 */
	protected $logger;
	/**
	 * @var Indexable_Date_Archive_Builder
	 */
	private $date_archive_builder;

	/**
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @param Indexable_Author_Builder            $author_builder            The author builder for creating missing indexables.
	 * @param Indexable_Post_Builder              $post_builder              The post builder for creating missing indexables.
	 * @param Indexable_Term_Builder              $term_builder              The term builder for creating missing indexables.
	 * @param Indexable_Home_Page_Builder         $home_page_builder         The front page builder for creating missing indexables.
	 * @param Indexable_Post_Type_Archive_Builder $post_type_archive_builder The post type archive builder for creating missing indexables.
	 * @param Indexable_Date_Archive_Builder      $date_archive_builder      The date archive builder for creating missing indexables.
	 * @param Indexable_Search_Result_Builder     $search_result_builder     The search result builder for creating missing indexables.
	 * @param Current_Page_Helper                 $current_page_helper       The current post helper.
	 * @param Logger                              $logger                    The logger.
	 */
	public function __construct(
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Indexable_Home_Page_Builder $home_page_builder,
		Indexable_Post_Type_Archive_Builder $post_type_archive_builder,
		Indexable_Date_Archive_Builder $date_archive_builder,
		Indexable_Search_Result_Builder $search_result_builder,
		Current_Page_Helper $current_page_helper,
		Logger $logger
	) {
		$this->author_builder            = $author_builder;
		$this->post_builder              = $post_builder;
		$this->term_builder              = $term_builder;
		$this->home_page_builder         = $home_page_builder;
		$this->post_type_archive_builder = $post_type_archive_builder;
		$this->date_archive_builder      = $date_archive_builder;
		$this->search_result_builder     = $search_result_builder;
		$this->current_page_helper       = $current_page_helper;
		$this->logger                    = $logger;
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
			case $this->current_page_helper->is_simple_page():
				return $this->find_by_id_and_type( $this->current_page_helper->get_simple_page_id(), 'post' );
			case $this->current_page_helper->is_home_static_page():
				return $this->find_by_id_and_type( $this->current_page_helper->get_front_page_id(), 'post' );
			case $this->current_page_helper->is_home_posts_page():
				return $this->find_for_home_page();
			case $this->current_page_helper->is_term_archive():
				return $this->find_by_id_and_type( $this->current_page_helper->get_term_id(), 'term' );
			case $this->current_page_helper->is_date_archive():
				return $this->find_for_date_archive();
			case $this->current_page_helper->is_search_result():
				return $this->query()->create( [ 'object_type' => 'search-result-page', 'title' ] );
			case $this->current_page_helper->is_post_type_archive():
				return $this->find_for_post_type_archive( $this->current_page_helper->get_queried_post_type() );
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
			$indexable = $this->create_for_date_archive();
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
	 * Retrieves the search result indexable.
	 *
	 * @param bool $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public function find_for_search_result( $auto_create = true ) {
		/**
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable = $this->query()->where( 'object_type', 'search-result' )->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->create_for_search_result();
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
		$indexable = $this->query()->create( [ 'object_id' => $object_id, 'object_type' => $object_type ] );

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
	 * Creates an indexable for the date archive.
	 *
	 * @return Indexable The date archive indexable.
	 */
	public function create_for_date_archive() {
		$indexable = $this->query()->create();
		$indexable = $this->date_archive_builder->build( $indexable );

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
	 * Creates an indexable for search results.
	 *
	 * @return Indexable The search result indexable.
	 */
	public function create_for_search_result() {
		$indexable = $this->query()->create( [ 'object_type' => 'home-page' ] );
		$indexable = $this->search_result_builder->build( $indexable );

		$indexable->save();
		return $indexable;
	}
}
