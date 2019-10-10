<?php
/**
 * Search result watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Integrations\Watchers;

use Yoast\WP\Free\Builders\Indexable_System_Page_Builder;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Repositories\Indexable_Repository;

/**
 * Watches the search result options to save the meta information when updated.
 */
class Indexable_System_Page_Watcher implements Integration_Interface {

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
	 * @var Indexable_System_Page_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param Indexable_Repository          $repository The repository to use.
	 * @param Indexable_System_Page_Builder $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_System_Page_Builder $builder ) {
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
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_option( $old_value, $new_value ) {
		foreach ( Indexable_System_Page_Builder::OPTION_MAPPING as $type => $option ) {
			// If both values aren't set they haven't changed.
			if ( ! isset( $old_value[ $option ] ) && ! isset( $new_value[ $option ] ) ) {
				return;
			}

			// If the value was set but now isn't, is set but wasn't or is not the same it has changed.
			if (
				! isset( $old_value[ $option ] ) ||
				! isset( $new_value[ $option ] ) ||
				$old_value[ $option ] !== $new_value[ $option ]
			) {
				$this->build_indexable( $type );
			}
		}
	}

	/**
	 * Saves the search result.
	 *
	 * @param string $type The type of no index page.
	 *
	 * @return void
	 */
	public function build_indexable( $type ) {
		$indexable = $this->repository->find_for_system_page( $type, false );
		$indexable = ( $indexable === false ) ? $this->repository->create_for_system_page( $type ) : $this->builder->build( $type, $indexable );
		$indexable->save();
	}
}
