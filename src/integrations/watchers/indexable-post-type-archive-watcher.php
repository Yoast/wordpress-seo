<?php
/**
 * Post type archive watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Integrations\Watchers;

use Yoast\WP\Free\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Repositories\Indexable_Repository;

/**
 * Watches the home page options to save the meta information when updated.
 */
class Indexable_Post_Type_Archive_Watcher implements Integration_Interface {

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
	 * @var \Yoast\WP\Free\Builders\Indexable_Post_Type_Archive_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param Indexable_Repository                $repository The repository to use.
	 * @param Indexable_Post_Type_Archive_Builder $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Post_Type_Archive_Builder $builder ) {
		$this->repository = $repository;
		$this->builder    = $builder;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		add_action( 'update_option_wpseo_titles', [ $this, 'check_option' ], 10, 2 );
	}

	/**
	 * Checks if the home page indexable needs to be rebuild based on option values.
	 *
	 * @param array  $old_value The old value of the option.
	 * @param array  $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_option( $old_value, $new_value ) {
		$relevant_keys = [ 'title-ptarchive-', 'metadesc-ptarchive-', 'bctitle-ptarchive-', 'noindex-ptarchive-' ];

		if ( ! is_array( $old_value ) || ! is_array( $new_value ) ) {
			return;
		}

		$keys               = array_unique( array_merge( array_keys( $old_value ), array_keys( $new_value ) ) );
		$post_types_rebuild = [];

		foreach ( $keys as $key ) {
			$post_type = false;
			// Check if it's a key relevant to post type archives.
			foreach ( $relevant_keys as $relevant_key ) {
				if ( strpos( $key, $relevant_key ) === 0 ) {
					$post_type = substr( $key, strlen( $relevant_key ) );
					break;
				}
			}

			// If it's not a relevant key or both values aren't set they haven't changed.
			if ( $post_type === false || ( ! isset( $old_value[ $key ] ) && ! isset( $new_value[ $key ] ) ) ) {
				continue;
			}

			// If the value was set but now isn't, is set but wasn't or is not the same it has changed.
			if (
				! in_array( $post_type, $post_types_rebuild ) &&
				(
					! isset( $old_value[ $key ] ) ||
					! isset( $new_value[ $key ] ) ||
					$old_value[ $key ] !== $new_value[ $key ]
				)
			) {
				$this->build_indexable( $post_type );
				$post_types_rebuild[] = $post_type;
			}
		}
	}

	/**
	 * Saves the home page.
	 *
	 * @return void
	 */
	public function build_indexable( $post_type ) {
		$indexable = $this->repository->find_for_post_type_archive( $post_type, false );
		$indexable = ( $indexable === false ) ? $this->repository->create_for_post_type_archive( $post_type ) : $this->builder->build( $post_type, $indexable );
		$indexable->save();
	}
}
