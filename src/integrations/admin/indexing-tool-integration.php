<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\No_Tool_Selected_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexing_List_Item_Presenter;
use Yoast\WP\SEO\Routes\Indexing_Route;

/**
 * Class Indexing_Tool_Integration. Bridge to the Javascript indexing tool on Yoast SEO Tools page.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Indexing_Tool_Integration implements Integration_Interface {

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the indexables helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Represents the indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			Migrations_Conditional::class,
			No_Tool_Selected_Conditional::class,
			Yoast_Tools_Page_Conditional::class,
		];
	}

	/**
	 * Indexing_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager     The admin asset manager.
	 * @param Indexable_Helper          $indexable_helper  The indexable helper.
	 * @param Short_Link_Helper         $short_link_helper The short link helper.
	 * @param Indexing_Helper           $indexing_helper   The indexing helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Indexable_Helper $indexable_helper,
		Short_Link_Helper $short_link_helper,
		Indexing_Helper $indexing_helper
	) {
		$this->asset_manager     = $asset_manager;
		$this->indexable_helper  = $indexable_helper;
		$this->short_link_helper = $short_link_helper;
		$this->indexing_helper   = $indexing_helper;
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		\add_action( 'wpseo_tools_overview_list_items', [ $this, 'render_indexing_list_item' ], 10 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10 );
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
			'disabled'  => ! $this->indexable_helper->should_index_indexables(),
			'amount'    => $this->indexing_helper->get_filtered_unindexed_count(),
			'firstTime' => ( $this->indexing_helper->is_initial_indexing() === true ),
			'restApi'   => [
				'root'      => \esc_url_raw( \rest_url() ),
				'endpoints' => $this->get_endpoints(),
				'nonce'     => \wp_create_nonce( 'wp_rest' ),
			],
		];

		/**
		 * Filter: 'wpseo_indexing_data' Filter to adapt the data used in the indexing process.
		 *
		 * @param array $data The indexing data to adapt.
		 */
		$data = \apply_filters( 'wpseo_indexing_data', $data );

		$this->asset_manager->localize_script( 'indexation', 'yoastIndexingData', $data );
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
		$endpoints = [
			'prepare'            => Indexing_Route::FULL_PREPARE_ROUTE,
			'terms'              => Indexing_Route::FULL_TERMS_ROUTE,
			'posts'              => Indexing_Route::FULL_POSTS_ROUTE,
			'archives'           => Indexing_Route::FULL_POST_TYPE_ARCHIVES_ROUTE,
			'general'            => Indexing_Route::FULL_GENERAL_ROUTE,
			'indexablesComplete' => Indexing_Route::FULL_INDEXABLES_COMPLETE_ROUTE,
			'post_link'          => Indexing_Route::FULL_POST_LINKS_INDEXING_ROUTE,
			'term_link'          => Indexing_Route::FULL_TERM_LINKS_INDEXING_ROUTE,
		];

		$endpoints = \apply_filters( 'wpseo_indexing_endpoints', $endpoints );

		$endpoints['complete'] = Indexing_Route::FULL_COMPLETE_ROUTE;

		return $endpoints;
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @deprecated 15.3
	 * @codeCoverageIgnore
	 *
	 * @param int $unindexed_count The total number of unindexed indexables.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_unindexed_indexables_count( $unindexed_count = 0 ) {
		\_deprecated_function( __METHOD__, 'WPSEO 15.3' );

		return $this->indexing_helper->get_unindexed_count();
	}

	/**
	 * Returns the total number of unindexed objects and applies a filter for third party integrations.
	 *
	 * @deprecated 15.3
	 * @codeCoverageIgnore
	 *
	 * @param int $unindexed_count The total number of unindexed objects.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_unindexed_count( $unindexed_count = 0 ) {
		\_deprecated_function( __METHOD__, 'WPSEO 15.3' );

		return $this->indexing_helper->get_filtered_unindexed_count();
	}
}
