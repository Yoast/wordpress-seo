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
use Yoast\WP\Free\Builders\Indexable_Term_Builder;
use Yoast\WP\Free\Helpers\Current_Post_Helper;
use Yoast\WP\Free\Loggers\Logger;
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
	 * @var \Yoast\WP\Free\Helpers\Current_Post_Helper
	 */
	protected $current_post_helper;

	/**
	 * @var \Psr\Log\LoggerInterface
	 */
	protected $logger;

	/**
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @param \Yoast\WP\Free\Builders\Indexable_Author_Builder    $author_builder      The author builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Builders\Indexable_Post_Builder      $post_builder        The post builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Builders\Indexable_Term_Builder      $term_builder        The term builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Builders\Indexable_Home_Page_Builder $home_page_builder  The front page builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Helpers\Current_Post_Helper          $current_post_helper The current post helper.
	 * @param \Yoast\WP\Free\Loggers\Logger                       $logger              The logger.
	 */
	public function __construct(
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Indexable_Home_Page_Builder $home_page_builder,
		Current_Post_Helper $current_post_helper,
		Logger $logger
	) {
		$this->author_builder      = $author_builder;
		$this->post_builder        = $post_builder;
		$this->term_builder        = $term_builder;
		$this->home_page_builder   = $home_page_builder;
		$this->current_post_helper = $current_post_helper;
		$this->logger              = $logger;
	}

	/**
	 * Starts a query for this repository.
	 *
	 * @return \Yoast\WP\Free\ORM\ORMWrapper
	 */
	public function query() {
		return Yoast_Model::of_type( 'Indexable' );
	}

	/**
	 * Attempts to find the indexable for the current WordPress page. Returns false if no indexable could be found.
	 * This may be the result of the indexable not existing or of being unable to determine what type of page the
	 * current page is.
	 *
	 * @return bool|\Yoast\WP\Free\Models\Indexable The indexable, false if none could be found.
	 */
	public function for_current_page() {
		if ( $this->current_post_helper->is_simple_page() ) {
			return $this->find_by_id_and_type( $this->current_post_helper->get_simple_page_id(), 'post' );
		}
		if ( $this->current_post_helper->is_home_static_page() ) {
			return $this->find_by_id_and_type( $this->current_post_helper->get_front_page_id(), 'post' );
		}
		if ( $this->current_post_helper->is_home_posts_page() ) {
			return $this->find_home_page();
		}

		return false;
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
	 * @return bool|\Yoast\WP\Free\Models\Indexable Instance of indexable.
	 */
	public function find_home_page( $auto_create = true ) {
		/**
		 * Indexable instance.
		 *
		 * @var \Yoast\WP\Free\Models\Indexable $indexable
		 */
		$indexable = $this->query()->where( 'object_type', 'home-page' )->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->query()->create( [ 'object_type' => 'home-page' ] );
			$indexable = $this->home_page_builder->build( $indexable );
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
	 * @return bool|\Yoast\WP\Free\Models\Indexable Instance of indexable.
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
	 * @return \Yoast\WP\Free\Models\Indexable[] An array of indexables.
	 */
	public function find_by_multiple_ids_and_type( $object_ids, $object_type, $auto_create = true ) {
		$indexables = $this->query()
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
}
