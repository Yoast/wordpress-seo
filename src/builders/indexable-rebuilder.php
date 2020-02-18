<?php
/**
 * Rebuilder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Repositories\Indexable_Repository;

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
	 * Indexable_Rebuilder constructor.
	 *
	 * @param Indexable_Repository $repository The repository to use.
	 * @param Indexable_Builder    $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Builder $builder ) {
		$this->repository = $repository;
		$this->builder    = $builder;
	}

	/**
	 * Builds the indexables for an object type.
	 *
	 * @param string $object_type The object type.
	 *
	 * @throws \Exception
	 */
	public function rebuild_for_type( $object_type ) {
		try {
			$indexables = $this->repository->find_all_with_type( $object_type );
			foreach ( $indexables as $indexable ) {
				$this->builder->build_for_id_and_type( $indexable->object_id, $object_type, $indexable );
			}
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Builds the indexables that have the given object sub type.
	 *
	 * @param string $object_type     The object type.
	 * @param string $object_sub_type The object sub type.
	 *
	 * @throws \Exception
	 */
	public function rebuild_for_type_and_sub_type( $object_type, $object_sub_type ) {
		try {
			$indexables = $this->repository->find_all_with_type_and_sub_type( $object_type, $object_sub_type );
			foreach ( $indexables as $indexable ) {
				$this->builder->build_for_id_and_type( $indexable->object_id, $object_type, $indexable );
			}
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Builds the post type archive indexable.
	 *
	 * @param string $post_type The post type.
	 */
	public function rebuild_for_post_type_archive( $post_type ) {
		try {
			$indexable = $this->repository->find_for_post_type_archive( $post_type, false );
			$this->builder->build_for_post_type_archive( $post_type, $indexable );
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Rebuilds the indexable for the date archive.
	 */
	public function rebuild_for_date_archive() {
		try {
			$indexable = $this->repository->find_for_date_archive( false );
			$this->builder->build_for_date_archive( $indexable );
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}
}
