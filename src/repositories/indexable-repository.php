<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\SEO\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Psr\Log\LoggerInterface;
use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Repository
 */
class Indexable_Repository {

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	private $builder;

	/**
	 * Represents the hierarchy repository.
	 *
	 * @var Indexable_Hierarchy_Repository
	 */
	protected $hierarchy_repository;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * The logger object.
	 *
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * The WordPress database.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @param Indexable_Builder              $builder              The indexable builder.
	 * @param Current_Page_Helper            $current_page         The current post helper.
	 * @param Logger                         $logger               The logger.
	 * @param Indexable_Hierarchy_Repository $hierarchy_repository The hierarchy repository.
	 * @param wpdb                           $wpdb                 The WordPress database instance.
	 * @param Indexable_Helper               $indexable_helper     The indexable helper.
	 */
	public function __construct(
		Indexable_Builder $builder,
		Current_Page_Helper $current_page,
		Logger $logger,
		Indexable_Hierarchy_Repository $hierarchy_repository,
		wpdb $wpdb,
		Indexable_Helper $indexable_helper
	) {
		$this->builder              = $builder;
		$this->current_page         = $current_page;
		$this->logger               = $logger;
		$this->hierarchy_repository = $hierarchy_repository;
		$this->wpdb                 = $wpdb;
		$this->indexable_helper     = $indexable_helper;
	}

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'Indexable' );
	}

	/**
	 * Attempts to find the indexable for the current WordPress page. Returns false if no indexable could be found.
	 * This may be the result of the indexable not existing or of being unable to determine what type of page the
	 * current page is.
	 *
	 * @return bool|Indexable The indexable, false if none could be found.
	 */
	public function for_current_page() {
		$indexable = false;

		switch ( true ) {
			case $this->current_page->is_simple_page():
				$indexable = $this->find_by_id_and_type( $this->current_page->get_simple_page_id(), 'post' );
				break;
			case $this->current_page->is_home_static_page():
				$indexable = $this->find_by_id_and_type( $this->current_page->get_front_page_id(), 'post' );
				break;
			case $this->current_page->is_home_posts_page():
				$indexable = $this->find_for_home_page();
				break;
			case $this->current_page->is_term_archive():
				$indexable = $this->find_by_id_and_type( $this->current_page->get_term_id(), 'term' );
				break;
			case $this->current_page->is_date_archive():
				$indexable = $this->find_for_date_archive();
				break;
			case $this->current_page->is_search_result():
				$indexable = $this->find_for_system_page( 'search-result' );
				break;
			case $this->current_page->is_post_type_archive():
				$indexable = $this->find_for_post_type_archive( $this->current_page->get_queried_post_type() );
				break;
			case $this->current_page->is_author_archive():
				$indexable = $this->find_by_id_and_type( $this->current_page->get_author_id(), 'user' );
				break;
			case $this->current_page->is_404():
				$indexable = $this->find_for_system_page( '404' );
				break;
		}

		if ( $indexable === false ) {
			return $this->query()->create(
				[
					'object_type' => 'unknown',
					'post_status' => 'unindexed',
				]
			);
		}

		return $indexable;
	}

	/**
	 * Retrieves an indexable by its permalink.
	 *
	 * @param string $permalink The indexable permalink.
	 *
	 * @return bool|Indexable The indexable, false if none could be found.
	 */
	public function find_by_permalink( $permalink ) {
		$permalink_hash = \strlen( $permalink ) . ':' . \md5( $permalink );

		// Find by both permalink_hash and permalink, permalink_hash is indexed so will be used first by the DB to optimize the query.
		return $this->query()
			->where( 'permalink_hash', $permalink_hash )
			->where( 'permalink', $permalink )
			->find_one();
	}

	/**
	 * Retrieves all the indexable instances of a certain object type.
	 *
	 * @param string $object_type The object type.
	 *
	 * @return Indexable[] The array with all the indexable instances of a certain object type.
	 */
	public function find_all_with_type( $object_type ) {
		/**
		 * The array with all the indexable instances of a certain object type.
		 *
		 * @var Indexable[] $indexables
		 */
		$indexables = $this
			->query()
			->where( 'object_type', $object_type )
			->find_many();

		return \array_map( [ $this, 'ensure_permalink' ], $indexables );
	}

	/**
	 * Retrieves all the indexable instances of a certain object subtype.
	 *
	 * @param string $object_type     The object type.
	 * @param string $object_sub_type The object subtype.
	 *
	 * @return Indexable[] The array with all the indexable instances of a certain object subtype.
	 */
	public function find_all_with_type_and_sub_type( $object_type, $object_sub_type ) {
		/**
		 * The array with all the indexable instances of a certain object type and subtype.
		 *
		 * @var Indexable[] $indexables
		 */
		$indexables = $this
			->query()
			->where( 'object_type', $object_type )
			->where( 'object_sub_type', $object_sub_type )
			->find_many();

		return \array_map( [ $this, 'ensure_permalink' ], $indexables );
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

		return $this->ensure_permalink( $indexable );
	}

	/**
	 * Retrieves the date archive indexable.
	 *
	 * @param bool $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public function find_for_date_archive( $auto_create = true ) {
		/**
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable = $this->query()->where( 'object_type', 'date-archive' )->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->builder->build_for_date_archive();
		}

		return $this->ensure_permalink( $indexable );
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

		return $this->ensure_permalink( $indexable );
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

		return $this->ensure_permalink( $indexable );
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

		return $this->ensure_permalink( $indexable );
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
		if ( empty( $object_ids ) ) {
			return [];
		}

		/**
		 * Represents an array of indexable objects.
		 *
		 * @var Indexable[] $indexables
		 */
		$indexables = $this->query()
			->where_in( 'object_id', $object_ids )
			->where( 'object_type', $object_type )
			->find_many();

		if ( $auto_create ) {
			$indexables_available = [];
			foreach ( $indexables as $indexable ) {
				$indexables_available[] = $indexable->object_id;
			}

			$indexables_to_create = \array_diff( $object_ids, $indexables_available );

			foreach ( $indexables_to_create as $indexable_to_create ) {
				$indexables[] = $this->builder->build_for_id_and_type( $indexable_to_create, $object_type );
			}
		}

		return \array_map( [ $this, 'ensure_permalink' ], $indexables );
	}

	/**
	 * Returns all ancestors of a given indexable.
	 *
	 * @param Indexable $indexable The indexable to find the ancestors of.
	 *
	 * @return Indexable[] All ancestors of the given indexable.
	 */
	public function get_ancestors( Indexable $indexable ) {
		// If we've already set ancestors on the indexable no need to get them again.
		if ( \is_array( $indexable->ancestors ) && ! empty( $indexable->ancestors ) ) {
			return \array_map( [ $this, 'ensure_permalink' ], $indexable->ancestors );
		}

		$indexable_ids = $this->hierarchy_repository->find_ancestors( $indexable );

		// If we've set ancestors on the indexable because we had to build them to find them.
		if ( \is_array( $indexable->ancestors ) && ! empty( $indexable->ancestors ) ) {
			return \array_map( [ $this, 'ensure_permalink' ], $indexable->ancestors );
		}

		if ( empty( $indexable_ids ) ) {
			return [];
		}

		if ( $indexable_ids[0] === 0 && \count( $indexable_ids ) === 1 ) {
			return [];
		}

		$indexables = $this->query()
			->where_in( 'id', $indexable_ids )
			->order_by_expr( 'FIELD(id,' . \implode( ',', $indexable_ids ) . ')' )
			->find_many();

		return \array_map( [ $this, 'ensure_permalink' ], $indexables );
	}

	/**
	 * Returns all children of a given indexable.
	 *
	 * @param Indexable $indexable The indexable to find the children of.
	 *
	 * @return Indexable[] All children of the given indexable.
	 */
	public function get_children( Indexable $indexable ) {
		$indexable_ids = $this->hierarchy_repository->find_children( $indexable );

		if ( empty( $indexable_ids ) ) {
			return [];
		}

		$indexables = $this
			->query()
			->where_in( 'id', $indexable_ids )
			->order_by_expr( 'FIELD(id,' . \implode( ',', $indexable_ids ) . ')' )
			->find_many();

		return \array_map( [ $this, 'ensure_permalink' ], $indexables );
	}

	/**
	 * Returns all subpages with a given post_parent.
	 *
	 * @param int   $post_parent The post parent.
	 * @param array $exclude_ids The ids to exclude.
	 *
	 * @return Indexable[] array of indexables.
	 */
	public function get_subpages_by_post_parent( $post_parent, $exclude_ids = [] ) {
		$query = $this->query()
			->where( 'post_parent', $post_parent )
			->where( 'object_type', 'post' )
			->where( 'post_status', 'publish' );

		if ( ! empty( $exclude_ids ) ) {
			$query->where_not_in( 'object_id', $exclude_ids );
		}
		return $query->find_many();
	}

	/**
	 * Updates the incoming link count for an indexable without first fetching it.
	 *
	 * @param int $indexable_id The indexable ID.
	 * @param int $count        The incoming link count.
	 *
	 * @return bool Whether or not the update was succeful.
	 */
	public function update_incoming_link_count( $indexable_id, $count ) {
		return (bool) $this->query()
			->set( 'incoming_link_count', $count )
			->where( 'id', $indexable_id )
			->update_many();
	}

	/**
	 * Ensures that the given indexable has a permalink.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return bool|Indexable The indexable.
	 */
	protected function ensure_permalink( $indexable ) {
		if ( $indexable && $indexable->permalink === null ) {
			$indexable->permalink = $this->indexable_helper->get_permalink_for_indexable( $indexable );

			// Only save if changed.
			if ( $indexable->permalink !== null ) {
				$indexable->save();
			}
		}
		return $indexable;
	}
}
