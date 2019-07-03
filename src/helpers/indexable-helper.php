<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Helpers;

use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Builders\Indexable_Post_Builder;
use Yoast\WP\Free\Builders\Indexable_Term_Builder;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\ORM\Repositories\Indexable_Repository;
use Psr\Log\LoggerInterface;

/**
 * Class Indexable_Helper
 */
class Indexable_Helper {

	/**
	 * @var Indexable_Repository
	 */
	protected $repository;

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
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * Indexable_Repository constructor.
	 *
	 * @param Indexable_Author_Builder $author_builder
	 * @param Indexable_Post_Builder   $post_builder
	 * @param Indexable_Term_Builder   $term_builder
	 * @param Logger                     $logger
	 */
	public function __construct(
		Indexable_Repository $repository,
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Logger $logger
	) {
		$this->repository     = $repository;
		$this->author_builder = $author_builder;
		$this->post_builder   = $post_builder;
		$this->term_builder   = $term_builder;
		$this->logger         = $logger;
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
		return $this->repository->where( 'url_hash', $url_hash )
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
		$indexable = $this->repository->where( 'object_id', $object_id )
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
		/*
		 * Indexable instance.
		 *
		 * @var \Yoast\WP\Free\Models\Indexable $indexable
		 */
		$indexable              = $this->repository->create();
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
