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
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @param \Yoast\WP\Free\Builders\Indexable_Author_Builder $author_builder The author builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Builders\Indexable_Post_Builder   $post_builder   The post builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Builders\Indexable_Term_Builder   $term_builder   The term builder for creating missing indexables.
	 * @param \Yoast\WP\Free\Loggers\Logger                    $logger         The logger.
	 *
	 * @return Indexable_Repository
	 */
	public static function get_instance(
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Logger $logger
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

		return $instance;
	}

	/**
	 * Retrieves an indexable by it's URL.
	 *
	 * @param string $url The indexable url.
	 */
	public function find_by_url( $url ) {
		$url      = trailingslashit( $url );
		$url_hash = strlen( $url ) . ':' . md5( $url );

		// Find by both url_hash and url, url_hash is indexed so will be used first by the DB to optimize the query.
		return $this->where( 'url_hash', $url_hash )
					->where( 'url', $url )
					->find_one();
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
		$indexable = $this->where( 'object_id', $object_id )
			->where( 'object_type', $object_type )
			->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->create_for_id_and_type( $object_id, $object_type );
		}

		return $indexable;
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
}
