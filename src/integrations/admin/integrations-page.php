<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Plugin_Availability;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Jetpack_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
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

		$elementor_conditional   = new Elementor_Activated_Conditional();
		$jetpack_conditional     = new Jetpack_Conditional();
		$woocommerce_conditional = new WooCommerce_Conditional();

		$woocommerce_seo_file = 'wpseo-woocommerce/wpseo-woocommerce.php';
		$acf_seo_file         = 'acf-content-analysis-for-yoast-seo/yoast-acf-analysis.php';
		$acf_seo_file_github  = 'yoast-acf-analysis/yoast-acf-analysis.php';
		$algolia_file         = 'wp-search-with-algolia/algolia.php';
		$old_algolia_file     = 'search-by-algolia-instant-relevant-results/algolia.php';

		$wpseo_plugin_availability_checker = new WPSEO_Plugin_Availability();
		$woocommerce_seo_installed         = \file_exists( WP_PLUGIN_DIR . '/' . $woocommerce_seo_file );
		$woocommerce_seo_active            = $wpseo_plugin_availability_checker->is_active( $woocommerce_seo_file );
		$woocommerce_active                = $woocommerce_conditional->is_met();
		$acf_seo_installed                 = \file_exists( WP_PLUGIN_DIR . '/' . $acf_seo_file );
		$acf_seo_github_installed          = \file_exists( WP_PLUGIN_DIR . '/' . $acf_seo_file_github );
		$acf_seo_active                    = $wpseo_plugin_availability_checker->is_active( $acf_seo_file );
		$acf_seo_github_active             = $wpseo_plugin_availability_checker->is_active( $acf_seo_file_github );
		$acf_active                        = \class_exists( 'acf' );
		$algolia_active                    = $wpseo_plugin_availability_checker->is_active( $algolia_file );
		$old_algolia_active                = $wpseo_plugin_availability_checker->is_active( $old_algolia_file );

		$woocommerce_seo_activate_url = \wp_nonce_url(
			\self_admin_url( 'plugins.php?action=activate&plugin=' . $woocommerce_seo_file ),
			'activate-plugin_' . $woocommerce_seo_file
		);

		if ( $acf_seo_installed ) {
			$acf_seo_activate_url = \wp_nonce_url(
				\self_admin_url( 'plugins.php?action=activate&plugin=' . $acf_seo_file ),
				'activate-plugin_' . $acf_seo_file
			);
		}
		else {
			$acf_seo_activate_url = \wp_nonce_url(
				\self_admin_url( 'plugins.php?action=activate&plugin=' . $acf_seo_file_github ),
				'activate-plugin_' . $acf_seo_file_github
			);
		}

		$acf_seo_install_url = \wp_nonce_url(
			\self_admin_url( 'update.php?action=install-plugin&plugin=acf-content-analysis-for-yoast-seo' ),
			'install-plugin_acf-content-analysis-for-yoast-seo'
		);

		$this->admin_asset_manager->localize_script(
			'integrations-page',
			'wpseoIntegrationsData',
			[
				'semrush_integration_active'     => $this->options_helper->get( 'semrush_integration_active', true ),
				'allow_semrush_integration'      => $this->options_helper->get( 'allow_semrush_integration_active', true ),
				'ryte_integration_active'        => $this->options_helper->get( 'ryte_indexability', true ),
				'allow_ryte_integration'         => $this->options_helper->get( 'allow_ryte_indexability', true ),
				'zapier_integration_active'      => $this->options_helper->get( 'zapier_integration_active', false ),
				'allow_zapier_integration'       => $this->options_helper->get( 'allow_zapier_integration_active', true ),
				'algolia_integration_active'     => $this->options_helper->get( 'algolia_integration_active', false ),
				'allow_algolia_integration'      => $this->options_helper->get( 'allow_algolia_integration_active', true ),
				'wincher_integration_active'     => $this->options_helper->get( 'wincher_integration_active', true ),
				'allow_wincher_integration'      => null,
				'wordproof_integration_active'   => $this->options_helper->get( 'wordproof_integration_active', true ),
				'allow_wordproof_integration'    => null,
				'elementor_integration_active'   => $elementor_conditional->is_met(),
				'jetpack_integration_active'     => $jetpack_conditional->is_met(),
				'woocommerce_seo_installed'      => $woocommerce_seo_installed,
				'woocommerce_seo_active'         => $woocommerce_seo_active,
				'woocommerce_active'             => $woocommerce_active,
				'woocommerce_seo_activate_url'   => $woocommerce_seo_activate_url,
				'acf_seo_installed'              => $acf_seo_installed || $acf_seo_github_installed,
				'acf_seo_active'                 => $acf_seo_active || $acf_seo_github_active,
				'acf_active'                     => $acf_active,
				'acf_seo_activate_url'           => $acf_seo_activate_url,
				'acf_seo_install_url'            => $acf_seo_install_url,
				'algolia_active'                 => $algolia_active || $old_algolia_active,
				'is_multisite'                   => \is_multisite(),
				'plugin_url'                     => \plugins_url( '', \WPSEO_FILE ),
			]
		);
	}

	/**
	 * Renders the target for the React to mount to.
	 */
	public function render_target() {
		?>
		<div class="wrap yoast wpseo-admin-page page-wpseo">
			<div class="wp-header-end" style="height: 0; width: 0;"></div>
			<div id="wpseo-integrations"></div>
		</div>
		<?php
	}
}
