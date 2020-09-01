<?php

namespace Yoast\WP\SEO\Builders;

use Exception;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use YoastSEO_Vendor\Psr\Log\LogLevel;

/**
 * Rebuilder for the indexables.
 *
 * Contains methods to find and build indexables.
 */
class Indexable_Rebuilder {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * Holds the logger.
	 *
	 * @var Logger
	 */
	protected $logger;

	/**
	 * Indexable_Rebuilder constructor.
	 *
	 * @codeCoverageIgnore No point in testing this constructor without side-effects.
	 *
	 * @param Indexable_Repository $repository The repository to use.
	 * @param Indexable_Builder    $builder    The post builder to use.
	 * @param Logger               $logger     The logger.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Builder $builder, Logger $logger ) {
		$this->repository = $repository;
		$this->builder    = $builder;
		$this->logger     = $logger;
	}

	/**
	 * Rebuilds the indexables for an object type.
	 *
	 * @param string $object_type The object type.
	 */
	public function rebuild_for_type( $object_type ) {
		try {
			$indexables = $this->repository->find_all_with_type( $object_type );
			foreach ( $indexables as $indexable ) {
				$this->builder->build_for_id_and_type( $indexable->object_id, $object_type, $indexable );
			}
		} catch ( Exception $exception ) {
			$this->logger->log( LogLevel::ERROR, $exception->getMessage() );
		}
	}

	/**
	 * Rebuilds the indexables that have the given object type and sub type.
	 *
	 * @param string $object_type     The object type.
	 * @param string $object_sub_type The object sub type.
	 */
	public function rebuild_for_type_and_sub_type( $object_type, $object_sub_type ) {
		try {
			$indexables = $this->repository->find_all_with_type_and_sub_type( $object_type, $object_sub_type );
			foreach ( $indexables as $indexable ) {
				$this->builder->build_for_id_and_type( $indexable->object_id, $object_type, $indexable );
			}
		} catch ( Exception $exception ) {
			$this->logger->log( LogLevel::ERROR, $exception->getMessage() );
		}
	}

	/**
	 * Rebuilds the post type archive indexable.
	 *
	 * Note: this does build the post type archive indexable, even when it did not exist before.
	 *
	 * @param string $post_type The post type.
	 */
	public function rebuild_for_post_type_archive( $post_type ) {
		try {
			$indexable = $this->repository->find_for_post_type_archive( $post_type, false );
			$this->builder->build_for_post_type_archive( $post_type, $indexable );
		} catch ( Exception $exception ) {
			$this->logger->log( LogLevel::ERROR, $exception->getMessage() );
		}
	}

	/**
	 * Rebuilds the indexable for the date archive.
	 *
	 * Note: this does build the date archive indexable, even when it did not exist before.
	 */
	public function rebuild_for_date_archive() {
		try {
			$indexable = $this->repository->find_for_date_archive( false );
			$this->builder->build_for_date_archive( $indexable );
		} catch ( Exception $exception ) {
			$this->logger->log( LogLevel::ERROR, $exception->getMessage() );
		}
	}
}
