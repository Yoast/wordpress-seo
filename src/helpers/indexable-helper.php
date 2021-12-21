<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexation_Action_Interface;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

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
	 * Manages versioning of the indexable builders.
	 *
	 * @var Indexable_Builder_Versions
	 */
	private $indexable_builder_versions;

	/**
	 * @var Indexation_Action_Interface
	 */
	private $indexable_post_indexation_action;
	/**
	 * @var Indexation_Action_Interface
	 */
	private $indexable_term_indexation_action;
	/**
	 * @var Indexation_Action_Interface
	 */
	private $indexable_post_type_archive_indexation_action;
	/**
	 * @var Indexation_Action_Interface
	 */
	private $indexable_general_indexation_action;

	/**
	 * Indexable_Helper constructor.
	 *
	 * @param Options_Helper     $options_helper     The options helper.
	 * @param Environment_Helper $environment_helper The environment helper.
	 * @param Indexing_Helper    $indexing_helper    The indexing helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Environment_Helper $environment_helper,
		Indexing_Helper $indexing_helper,
		Indexable_Builder_Versions $indexable_builder_versions
	) {
		$this->options_helper             = $options_helper;
		$this->environment_helper         = $environment_helper;
		$this->indexing_helper            = $indexing_helper;
		$this->indexable_builder_versions = $indexable_builder_versions;
	}


	/**
	 * @required
	 *
	 * @param Indexable_Post_Indexation_Action $indexable_post_indexation_action
	 *
	 * @return void
	 */
	public function set_indexable_post_indexation_action( Indexable_Post_Indexation_Action $indexable_post_indexation_action ) {
		$this->indexable_post_indexation_action = $indexable_post_indexation_action;
	}

	/**
	 * @required
	 *
	 * @param Indexable_Term_Indexation_Action $indexable_term_indexation_action
	 *
	 * @return void
	 */
	public function set_indexable_term_indexation_action( Indexable_Term_Indexation_Action $indexable_term_indexation_action ) {
		$this->indexable_term_indexation_action = $indexable_term_indexation_action;
	}

	/**
	 * @required
	 *
	 * @param Indexable_Post_Type_Archive_Indexation_Action $indexable_post_type_archive_indexation_action
	 *
	 * @return void
	 */
	public function set_indexable_post_type_archive_indexation_action( Indexable_Post_Type_Archive_Indexation_Action $indexable_post_type_archive_indexation_action ) {
		$this->indexable_post_type_archive_indexation_action = $indexable_post_type_archive_indexation_action;
	}

	/**
	 * @required
	 *
	 * @param Indexable_General_Indexation_Action $indexable_general_indexation_action
	 *
	 * @return void
	 */
	public function set_indexable_general_indexation_action( Indexable_General_Indexation_Action $indexable_general_indexation_action ) {
		$this->indexable_general_indexation_action = $indexable_general_indexation_action;
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

	public function index_is_up_to_date() {
		$cache_key = 'site_has_up_to_date_indexables';

		$cached_value = $this->options_helper->get( $cache_key );
		if ( $cached_value !== null ) {
			return (bool) $cached_value;
		}

		$indexables_are_up_to_date = ! $this->has_outdated_indexables() && ! $this->is_missing_indexables();


		$this->options_helper->set( $cache_key, true );

		return true;
	}

	/**
	 * @return bool
	 */
	protected function has_outdated_indexables() {
		$object_types = [
			'date-archive',
			'general',
			'home-page',
			'post',
			'post-type-archive',
			'term',
			'user',
			'system-page',
		];

		$or_conditions = [];
		$parameters    = [];
		foreach ( $object_types as $object_type ) {
			$latest_version_for_type = $this->indexable_builder_versions->get_latest_version_for_type( $object_type );
			$or_conditions[]         = '(`object_type` = %s AND `version` != $d)';
			$parameters[]            = $object_type;
			$parameters[]            = $latest_version_for_type;
		}

		return (bool) $this->repository
			->query()
			->select( 'id' )
			->where_raw( implode( ' OR ', $or_conditions ), $parameters )
			->find_one();
	}

	/**
	 * @return bool
	 */
	protected function is_missing_indexables() {
		$indexing_actions = [
			$this->indexable_post_indexation_action,
			$this->indexable_term_indexation_action,
			$this->indexable_post_type_archive_indexation_action,
			$this->indexable_general_indexation_action,
		];

		foreach ( $indexing_actions as $indexing_action ) {
			if ( $indexing_action->get_total_unindexed() > 0 ) {
				return false;
			}
		}

		// We don't have an author indexation action, so we need to calculate ourselves.

		/*
		 * The get_users() function disables counting, so se User_Query instead.
		 * The count_users() function queries the wp_capability metavalue, which we don't want because of performance reasons.
		 * The User_Query orders by user_login by default. ID is a bit faster in our case.
		 */
		$user_query        = new \WP_User_Query( [ 'fields' => 'ID', 'orderby' => 'ID' ] );
		$number_of_users = $user_query->get_total();

		$number_of_user_indexables = $this->repository
			->query()
			->where( 'object_type', 'user' )
			->count();

		return $number_of_user_indexables >= $number_of_users;
	}
}
