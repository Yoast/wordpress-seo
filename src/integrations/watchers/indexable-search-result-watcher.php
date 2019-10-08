<?php
/**
 * Search result watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Integrations\Watchers;

use Yoast\WP\Free\Builders\Indexable_Search_Result_Builder;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Repositories\Indexable_Repository;

/**
 * Watches the search result options to save the meta information when updated.
 */
class Indexable_Search_Result_Watcher implements Integration_Interface {

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
	 * @var Indexable_Search_Result_Builder
	 */
	protected $builder;

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param Indexable_Repository            $repository The repository to use.
	 * @param Indexable_Search_Result_Builder $builder    The post builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Search_Result_Builder $builder ) {
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
		// If both values aren't set they haven't changed.
		if ( ! isset( $old_value['title-search-wpseo'] ) && ! isset( $new_value['title-search-wpseo'] ) ) {
			return;
		}

		// If the value was set but now isn't, is set but wasn't or is not the same it has changed.
		if (
			! isset( $old_value['title-search-wpseo'] ) ||
			! isset( $new_value['title-search-wpseo'] ) ||
			$old_value['title-search-wpseo'] !== $new_value['title-search-wpseo']
		) {
			$this->build_indexable();
		}
	}

	/**
	 * Saves the search result.
	 *
	 * @return void
	 */
	public function build_indexable() {
		$indexable = $this->repository->find_for_search_result( false );
		$indexable = ( $indexable === false ) ? $this->repository->create_for_search_result() : $this->builder->build( $indexable );
		$indexable->save();
	}
}
