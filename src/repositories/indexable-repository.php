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
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @param Indexable_Builder   $builder             The indexable builder.
	 * @param Current_Page_Helper $current_page_helper The current post helper.
	 * @param Logger              $logger              The logger.
	 */
	public function __construct(
		Indexable_Builder $builder,
		Current_Page_Helper $current_page_helper,
		Logger $logger
	) {
		$this->builder      = $builder;
		$this->current_page = $current_page_helper;
		$this->logger       = $logger;

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
			$ancestor_queries[] = $ancestor_query->find_many();
		}



		return array_merge( ...$ancestor_queries );
	}
}
