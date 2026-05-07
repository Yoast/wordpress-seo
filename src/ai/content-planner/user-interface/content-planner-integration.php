<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Planner_Endpoints_Repository;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\AI_Editor_Conditional;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Content_Planner_Integration class.
 */
class Content_Planner_Integration implements Integration_Interface {

	/**
	 * The minimum number of published posts required for the feature to be available.
	 */
	public const MIN_PUBLISHED_POSTS = 5;

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * The endpoints repository.
	 *
	 * @var Content_Planner_Endpoints_Repository
	 */
	private $endpoints_repository;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals(): array {
		return [ AI_Conditional::class, AI_Editor_Conditional::class ];
	}

	/**
	 * Constructs the class.
	 *
	 * @param WPSEO_Admin_Asset_Manager            $asset_manager        The admin asset manager.
	 * @param Content_Planner_Endpoints_Repository $endpoints_repository The endpoints repository.
	 * @param Indexable_Repository                 $indexable_repository The indexable repository.
	 * @param User_Helper                          $user_helper          The user helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Content_Planner_Endpoints_Repository $endpoints_repository,
		Indexable_Repository $indexable_repository,
		User_Helper $user_helper
	) {
		$this->asset_manager        = $asset_manager;
		$this->endpoints_repository = $endpoints_repository;
		$this->indexable_repository = $indexable_repository;
		$this->user_helper          = $user_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		// Enqueue after Elementor_Premium integration, which re-registers the assets.
		\add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'enqueue_assets' ], 11 );
	}

	/**
	 * Returns the script data for the content planner.
	 *
	 * @return array{endpoints: array<string, string>, minPostsMet: bool, isBannerPermanentlyDismissed: bool}
	 */
	public function get_script_data(): array {
		return [
			'endpoints'                    => $this->endpoints_repository->get_all_endpoints()->to_paths_array(),
			'minPostsMet'                  => $this->is_minimum_posts_met(),
			'isBannerPermanentlyDismissed' => $this->is_banner_permanently_dismissed(),
		];
	}

	/**
	 * Localizes the content planner script data.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$this->asset_manager->enqueue_script( 'ai-content-planner' );
		$this->asset_manager->localize_script( 'ai-content-planner', 'wpseoContentPlanner', $this->get_script_data() );
	}

	/**
	 * Determines whether the site has at least the minimum number of published posts.
	 *
	 * Reuses Indexable_Repository::get_recently_modified_posts() with a limit equal to the threshold,
	 * so we never load more rows than necessary just to answer a "≥ N" question.
	 *
	 * @return bool Whether the site has met the minimum-posts threshold.
	 */
	private function is_minimum_posts_met(): bool {
		$posts = $this->indexable_repository->get_recently_modified_posts( 'post', self::MIN_PUBLISHED_POSTS, false );

		return \count( $posts ) >= self::MIN_PUBLISHED_POSTS;
	}

	/**
	 * Determines whether the current user has permanently dismissed the inline banner.
	 *
	 * @return bool Whether the banner is permanently dismissed for this user.
	 */
	private function is_banner_permanently_dismissed(): bool {
		$user_id = $this->user_helper->get_current_user_id();

		return (bool) $this->user_helper->get_meta( $user_id, Banner_Permanent_Dismissal_Route::USER_META_KEY, true );
	}
}
