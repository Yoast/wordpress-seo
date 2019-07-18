<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Integrations\Watchers;

use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\WordPress\Integration;

/**
 * Watches an Author to save the meta information when updated.
 */
class Indexable_Author_Watcher implements Integration {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * @var \Yoast\WP\Free\Repositories\Indexable_Repository
	 */
	protected $repository;

	/**
	 * @var \Yoast\WP\Free\Builders\Indexable_Author_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param \Yoast\WP\Free\Repositories\Indexable_Repository $repository The repository to use.
	 * @param \Yoast\WP\Free\Builders\Indexable_Author_Builder $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Author_Builder $builder ) {
		$this->repository = $repository;
		$this->builder    = $builder;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'profile_update', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'deleted_user', [ $this, 'delete_indexable' ] );
	}

	/**
	 * Deletes user meta.
	 *
	 * @param int $user_id User ID to delete the metadata of.
	 *
	 * @return void
	 */
	public function delete_indexable( $user_id ) {
		$indexable = $this->repository->find_by_id_and_type( $user_id, 'user', false );

		if ( ! $indexable ) {
			return;
		}

		$indexable->delete();
	}

	/**
	 * Saves user meta.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return void
	 */
	public function build_indexable( $user_id ) {
		$indexable = $this->repository->find_by_id_and_type( $user_id, 'user', false );

		// If we haven't found an existing indexable, create it. Otherwise update it.
		$indexable = ( $indexable === false ) ? $this->repository->create_for_id_and_type( $user_id, 'user' ) : $this->builder->build( $user_id, $indexable );

		$indexable->save();
	}
}
