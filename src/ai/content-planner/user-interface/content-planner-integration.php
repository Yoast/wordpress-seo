<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Planner_Endpoints_Repository;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\AI_Editor_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Content_Planner_Integration class.
 */
class Content_Planner_Integration implements Integration_Interface {

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
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Content_Planner_Endpoints_Repository $endpoints_repository
	) {
		$this->asset_manager        = $asset_manager;
		$this->endpoints_repository = $endpoints_repository;
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
	 * @return array<string, array<string>>
	 */
	public function get_script_data(): array {
		return [
			'endpoints' => $this->endpoints_repository->get_all_endpoints()->to_paths_array(),
		];
	}

	/**
	 * Localizes the content planner script data.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$this->asset_manager->localize_script( 'ai-content-planner', 'wpseoContentPlanner', $this->get_script_data() );
	}
}
