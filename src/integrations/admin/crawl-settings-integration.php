<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Option_Tab;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Beta_Badge_Presenter;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- First time configuration simply has a lot of words.
/**
 * Crawl_Settings_Integration class
 */
class Crawl_Settings_Integration implements Integration_Interface {

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Crawl_Settings_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager    The admin asset manager.
	 * @param Options_Helper            $options_helper         The options helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Options_Helper $options_helper
	) {
		$this->admin_asset_manager = $admin_asset_manager;
		$this->options_helper      = $options_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'wpseo_settings_tabs_dashboard', [ $this, 'add_crawl_settings_tab' ] );
	}

	/**
	 * Adds a dedicated tab in the General sub-page.
	 *
	 * @param WPSEO_Options_Tabs $dashboard_tabs Object representing the tabs of the General sub-page.
	 */
	public function add_crawl_settings_tab( $dashboard_tabs ) {
		$tab_label = '<span style="margin-right:4px;">'
		. __( 'Crawl settings', 'wordpress-seo' )
		. '</span>'
		. new Beta_Badge_Presenter( 'crawl-settings' );

		$dashboard_tabs->add_tab(
			new WPSEO_Option_Tab(
				'crawl-settings',
				$tab_label,
				[ 'save_button' => true ],
				true
			)
		);
	}

	/**
	 * Adds the needed scripts.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_dashboard' || \is_network_admin() ) {
			return;
		}

		$this->admin_asset_manager->enqueue_style( 'admin-css' );
	}
}
