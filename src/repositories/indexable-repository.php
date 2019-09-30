<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\Repositories;

use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Builders\Indexable_Post_Builder;
use Yoast\WP\Free\Builders\Indexable_Term_Builder;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\ORM\Yoast_Model;
use YoastSEO_Vendor\ORM;

/**
 * Class Indexable_Repository
 *
 * @package Yoast\WP\Free\ORM\Repositories
 */
class Indexable_Repository extends ORMWrapper {

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
	 * @param \Yoast\WP\Free\Builders\Indexable_Author_Builder $author_builder The author builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Builders\Indexable_Post_Builder   $post_builder   The post builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Builders\Indexable_Term_Builder   $term_builder   The term builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Loggers\Logger                    $logger         The logger.
	 * @param \wpdb                                            $wpdb           The WordPress database instance.
	 *
	 * @return \Yoast\WP\Free\Repositories\Indexable_Repository
	 */
	public static function get_instance(
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Logger $logger,
		\wpdb $wpdb
	) {
		ORMWrapper::$repositories[ Yoast_Model::get_table_name( 'Indexable' ) ] = self::class;

		/**
		 * @var $instance self
		 */
		$instance                 = Yoast_Model::of_type( 'Indexable' );
		$instance->author_builder = $author_builder;
		$instance->post_builder   = $post_builder;
		$instance->term_builder   = $term_builder;
		$instance->logger         = $logger;
		$instance->wpdb           = $wpdb;

		return $instance;
	}

	/**
	 * Retrieves an indexable by it's URL.
	 *
	 * @param string $url The indexable url.
	 */
	public function find_by_url( $url ) {
		$url      = \trailingslashit( $url );
		$url_hash = \strlen( $url ) . ':' . \md5( $url );

		// Find by both url_hash and url, url_hash is indexed so will be used first by the DB to optimize the query.
		return $this->where( 'url_hash', $url_hash )
					->where( 'url', $url )
					->find_one();
	}

	/**
	 * Retrieves an indexable by the ID and type of the indexable object.
	 *
	 * @param int    $object_id   The indexable object ID.
	 * @param string $object_type The indexable object type.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|\Yoast\WP\Free\Models\Indexable Instance of indexable.
	 */
	public function find_by_id_and_type( $object_id, $object_type, $auto_create = true ) {
		$indexable = $this->where( 'object_id', $object_id )
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
	 * @return \Yoast\WP\Free\Models\Indexable[] An array of indexables.
	 */
	public function find_by_multiple_ids_and_type( $object_ids, $object_type, $auto_create = true ) {
		$indexables = $this
			->where_in( 'object_id', $object_ids )
			->where( 'object_type', $object_type )
			->find_many();

		if ( $auto_create ) {
			$indexables_available = array_column( $indexables, 'object_id' );
			$indexables_to_create = array_diff( $object_ids, $indexables_available );

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
	 * @return bool|\Yoast\WP\Free\Models\Indexable Instance of indexable.
	 */
	public function create_for_id_and_type( $object_id, $object_type ) {
		/**
		 * Indexable instance.
		 *
		 * @var \Yoast\WP\Free\Models\Indexable $indexable
		 */
		$indexable              = $this->create();
		$indexable->object_id   = $object_id;
		$indexable->object_type = $object_type;

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
		return $this->where_id_in( $indexable_ids )->find_many();
	}

	/**
	 * Creates a query that can find posts with outdated prominent words.
	 *
	 * @param int      $updated_version The version required for posts to be up-to-date.
	 * @param string[] $post_types      The post types to find outdated posts for.
	 *
	 * @return \ORM Returns an ORM instance that can be used to execute the query.
	 */
	protected function create_query_for_outdated_prominent_words_posts( $updated_version, $post_types ) {
		$prefix = $this->wpdb->prefix;
		$posts_table = $prefix . 'posts';

		// Because we need it in the subquery we can't do $this->select.
		$indexables_table = Yoast_Model::get_table_name( 'Indexable' );

		$post_statuses = array( 'future', 'draft', 'pending', 'private', 'publish' );

		// Create a "?" placeholder for every post type to put in the query.
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
	 * Counts posts that have oudated prominent words.
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
	 * @param int      $updated_version The version required for posts to be up-to-date.
	 * @param string[] $post_types The post types to find posts for.
	 * @param int      $limit      The maximum amount of posts to return.
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
