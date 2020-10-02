<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Indexing_Interface;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexing_List_Item_Presenter;
use Yoast\WP\SEO\Surfaces\Classes_Surface;

/**
 * Class Indexing_Integration.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Indexing_Integration implements Integration_Interface {

	/**
	 * The total number of unindexed objects.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the integrations.
	 *
	 * @var Indexing_Interface[]
	 */
	protected $indexing_integrations = [];

	/**
	 * Represents the environment helper.
	 *
	 * @var Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			Yoast_Tools_Page_Conditional::class,
			Migrations_Conditional::class,
		];
	}

	/**
	 * Indexing_Integration constructor.
	 *
	 * @param Indexing_Indexables_Integration $indexing_indexables_integration The indexables_indexing integration.
	 * @param WPSEO_Admin_Asset_Manager       $asset_manager                   The admin asset manager.
	 * @param Environment_Helper              $environment_helper              The environment helper.
	 * @param Short_Link_Helper               $short_link_helper               The short link helper.
	 */
	public function __construct(
		Indexing_Indexables_Integration $indexing_indexables_integration,
		WPSEO_Admin_Asset_Manager $asset_manager,
		Environment_Helper $environment_helper,
		Short_Link_Helper $short_link_helper
	) {
		$this->asset_manager      = $asset_manager;
		$this->environment_helper = $environment_helper;
		$this->short_link_helper  = $short_link_helper;

		$this->indexing_integrations[] = $indexing_indexables_integration;
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		\add_action( 'wpseo_tools_overview_list_items', [ $this, 'render_indexing_list_item' ], 10 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'set_indexing_integrations' ], 9 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10 );
	}

	/**
	 * Sets the indexing integrations.
	 */
	public function set_indexing_integrations() {
		/**
		 * Filter: 'wpseo_indexing_instances' - Allow adding items for indexing content.
		 *
		 * @param Indexing_Integration[] $indexing_integrations The list of indexing integrations.
		 */
		$this->indexing_integrations = apply_filters( 'wpseo_indexing_instances', $this->indexing_integrations );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$this->asset_manager->enqueue_script( 'indexation' );
		$this->asset_manager->enqueue_style( 'admin-css' );
		$this->asset_manager->enqueue_style( 'monorepo' );

		$data = [
			'disabled' => ! $this->environment_helper->is_production_mode(),
			'amount'   => $this->get_total_unindexed(),
			'restApi'  => [
				'root'      => \esc_url_raw( \rest_url() ),
				'endpoints' => $this->get_endpoints(),
				'nonce'     => \wp_create_nonce( 'wp_rest' ),
			],
		];

		\wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'indexation', 'yoastIndexingData', $data );
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed = 0;
			foreach ( $this->indexing_integrations as $indexing_integration ) {
				$this->total_unindexed += $indexing_integration->get_total_unindexed();
			}
		}

		return $this->total_unindexed;
	}

	/**
	 * Renders the indexing list item.
	 *
	 * @return void
	 */
	public function render_indexing_list_item() {
		if ( \current_user_can( 'manage_options' ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- The output is correctly escaped in the presenter.
			echo new Indexing_List_Item_Presenter( $this->short_link_helper );
		}
	}

	/**
	 * Retrieves a list of the endpoints to use.
	 *
	 * @return array The endpoints.
	 */
	protected function get_endpoints() {
		$endpoints = [];

		foreach ( $this->indexing_integrations as $indexing_integration ) {
			$endpoints[] = $indexing_integration->get_endpoints();
		}

		return array_merge( [], ...$endpoints );
	}
}
