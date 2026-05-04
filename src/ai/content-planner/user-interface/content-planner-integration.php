<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Planner_Endpoints_Repository;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\AI_Editor_Conditional;
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
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Content_Planner_Endpoints_Repository $endpoints_repository,
		Indexable_Repository $indexable_repository
	) {
		$this->asset_manager        = $asset_manager;
		$this->endpoints_repository = $endpoints_repository;
		$this->indexable_repository = $indexable_repository;
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
	 * @return array{endpoints: array<string, string>, minPostsMet: bool}
	 */
	public function get_script_data(): array {
		return [
			'endpoints'   => $this->endpoints_repository->get_all_endpoints()->to_paths_array(),
			'minPostsMet' => $this->is_minimum_posts_met(),
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
	 * Returns the minimum-posts threshold, allowing override via filter.
	 *
	 * @return int The minimum number of published posts required.
	 */
	private function get_min_posts_threshold(): int {
		/**
		 * Filter: 'wpseo_content_planner_min_posts' - Allows overriding the minimum number of published posts
		 * required for the Content Planner feature to be available.
		 *
		 * @param int $min_posts The default minimum number of published posts.
		 */
		return (int) \apply_filters( 'wpseo_content_planner_min_posts', self::MIN_PUBLISHED_POSTS );
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
		$threshold = $this->get_min_posts_threshold();
		$posts     = $this->indexable_repository->get_recently_modified_posts( 'post', $threshold, false );

		return \count( $posts ) >= $threshold;
	}
}
