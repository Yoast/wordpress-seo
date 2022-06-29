<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Integrations_Page class
 */
class Integrations_Page implements Integration_Interface {

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The options helper.
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
	 * Workouts_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 * @param Options_Helper            $options_helper      The options helper.
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
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_submenu_page' ], 10 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ], 11 );
	}

	/**
	 * Adds the integrations submenu page.
	 *
	 * @param array $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return array The filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		$integrations_page = [
			'wpseo_dashboard',
			'',
			\__( 'Integrations', 'wordpress-seo' ),
			'wpseo_manage_options',
			'wpseo_integrations',
			[ $this, 'render_target' ],
		];

		\array_splice( $submenu_pages, 1, 0, [ $integrations_page ] );
		return $submenu_pages;
	}

	/**
	 * Enqueue the integrations app.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_integrations' ) {
			return;
		}

		$this->admin_asset_manager->enqueue_style( 'admin-css' );
		$this->admin_asset_manager->enqueue_style( 'tailwind' );
		$this->admin_asset_manager->enqueue_style( 'monorepo' );

		$this->admin_asset_manager->enqueue_script( 'integrations-page' );

		$this->admin_asset_manager->localize_script(
			'integrations-page',
			'wpseoIntegrationsData',
			[
				'semrush_integration_active'   => $this->options_helper->get( 'semrush_integration_active', true ),
				'ryte_indexability'            => $this->options_helper->get( 'ryte_indexability', true ),
				'zapier_integration_active'    => $this->options_helper->get( 'zapier_integration_active', false ),
				'algolia_integration_active'   => $this->options_helper->get( 'algolia_integration_active', false ),
				'wincher_integration_active'   => $this->options_helper->get( 'wincher_integration_active', true ),
				'wordproof_integration_active' => $this->options_helper->get( 'wordproof_integration_active', true ),
			]
		);
	}

	/**
	 * Renders the target for the React to mount to.
	 */
	public function render_target() {
		?>
		<div class="wrap yoast wpseo-admin-page page-wpseo">
			<h1><?php \esc_html_e( 'Integrations', 'wordpress-seo' ); ?></h1>
			<div id="wpseo-integrations"></div>
		</div>
		<?php
	}
}
