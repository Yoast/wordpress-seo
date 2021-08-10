<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * A helper object for indexables.
 */
class Indexable_Helper {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Represents the environment helper.
	 *
	 * @var Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * Represents the indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Indexable_Helper constructor.
	 *
	 * @param Options_Helper     $options_helper     The options helper.
	 * @param Environment_Helper $environment_helper The environment helper.
	 * @param Indexing_Helper    $indexing_helper    The indexing helper.
	 */
	public function __construct( Options_Helper $options_helper, Environment_Helper $environment_helper, Indexing_Helper $indexing_helper ) {
		$this->options_helper     = $options_helper;
		$this->environment_helper = $environment_helper;
		$this->indexing_helper    = $indexing_helper;
	}

	/**
	 * Sets the indexable repository. Done to avoid circular dependencies.
	 *
	 * @required
	 *
	 * @param Indexable_Repository $repository The indexable repository.
	 */
	public function set_indexable_repository( Indexable_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Returns the page type of an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string|false The page type. False if it could not be determined.
	 */
	public function get_page_type_for_indexable( $indexable ) {
		switch ( $indexable->object_type ) {
			case 'post':
				$front_page_id = (int) \get_option( 'page_on_front' );
				if ( $indexable->object_id === $front_page_id ) {
					return 'Static_Home_Page';
				}
				$posts_page_id = (int) \get_option( 'page_for_posts' );
				if ( $indexable->object_id === $posts_page_id ) {
					return 'Static_Posts_Page';
				}

				return 'Post_Type';
			case 'term':
				return 'Term_Archive';
			case 'user':
				return 'Author_Archive';
			case 'home-page':
				return 'Home_Page';
			case 'post-type-archive':
				return 'Post_Type_Archive';
			case 'date-archive':
				return 'Date_Archive';
			case 'system-page':
				if ( $indexable->object_sub_type === 'search-result' ) {
					return 'Search_Result_Page';
				}
				if ( $indexable->object_sub_type === '404' ) {
					return 'Error_Page';
				}
		}

		return false;
	}

	/**
	 * Resets the permalinks of the indexables.
	 *
	 * @param string|null $type    The type of the indexable.
	 * @param string|null $subtype The subtype. Can be null.
	 * @param string      $reason  The reason that the permalink has been changed.
	 */
	public function reset_permalink_indexables( $type = null, $subtype = null, $reason = Indexing_Reasons::REASON_PERMALINK_SETTINGS ) {
		$result = $this->repository->reset_permalink( $type, $subtype );

		$this->indexing_helper->set_reason( $reason );

		if ( $result !== false && $result > 0 ) {
			\delete_transient( Indexable_Post_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
			\delete_transient( Indexable_Post_Type_Archive_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
			\delete_transient( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
		}
	}

	/**
	 * Determines whether indexing indexables is appropriate at this time.
	 *
	 * @return bool Whether or not the indexables should be indexed.
	 */
	public function should_index_indexables() {
		// Currently the only reason to index is when we're on a production website.
		return $this->environment_helper->is_production_mode();
	}

	/**
	 * Returns whether or not dynamic permalinks should be used.
	 *
	 * @return bool Whether or not the dynamic permalinks should be used.
	 */
	public function dynamic_permalinks_enabled() {
		/**
		 * Filters the value of the `dynamic_permalinks` option.
		 *
		 * @param bool $value The value of the `dynamic_permalinks` option.
		 */
		return (bool) \apply_filters( 'wpseo_dynamic_permalinks_enabled', $this->options_helper->get( 'dynamic_permalinks', false ) );
	}

	/**
	 * Sets a boolean to indicate that the indexing of the indexables has completed.
	 *
	 * @return void
	 */
	public function finish_indexing() {
		$this->options_helper->set( 'indexables_indexing_completed', true );
	}
}
