<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Watchers;

use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Helpers\Indexable_Helper;
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
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * @var Indexable_Author_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param Indexable_Author_Builder $builder The post builder to use.
	 */
	public function __construct( Indexable_Helper $indexable_helper, Indexable_Author_Builder $builder ) {
		$this->indexable_helper = $indexable_helper;
		$this->builder          = $builder;
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
		$indexable = $this->indexable_helper->find_by_id_and_type( $user_id, 'user', false );

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
		$indexable = $this->indexable_helper->find_by_id_and_type( $user_id, 'user', false );

		// If we haven't found an existing indexable, create it. Otherwise update it.
		$indexable = $indexable === false
			? $this->indexable_helper->create_for_id_and_type( $user_id, 'user' )
			: $this->builder->build( $user_id, $indexable );

		$indexable->save();
	}
}
