<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Option_Tab;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Indexables_Page_Integration class
 */
class Indexables_Page_Integration implements Integration_Interface {

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Indexables_Page_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager    The admin asset manager.
	 * @param Product_Helper            $product_helper         The product helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Product_Helper $product_helper
	) {
		$this->admin_asset_manager = $admin_asset_manager;
		$this->product_helper      = $product_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'wpseo_settings_tabs_dashboard', [ $this, 'add_indexables_page_tab' ] );
	}

	/**
	 * Adds a dedicated tab in the General sub-page.
	 *
	 * @param WPSEO_Options_Tabs $dashboard_tabs Object representing the tabs of the General sub-page.
	 */
	public function add_indexables_page_tab( $dashboard_tabs ) {
		$dashboard_tabs->add_tab(
			new WPSEO_Option_Tab(
				'indexables-page',
				__( 'Indexables', 'wordpress-seo' ),
				[ 'save_button' => false ]
			)
		);
	}

	/**
	 * Enqueues assets for the Indexables Page.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_dashboard' || \is_network_admin() ) {
			return;
		}

		$this->admin_asset_manager->enqueue_script( 'indexables-page' );
		$this->admin_asset_manager->enqueue_style( 'tailwind' );
		$this->admin_asset_manager->enqueue_style( 'monorepo' );
	}
}
