<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Admin_Asset_Yoast_Components_L10n;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Installation_Success_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Installation_Success_Integration class
 */
class Installation_Success_Integration implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	protected $product_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class, Installation_Success_Conditional::class ];
	}

	/**
	 * Installation_Success_Integration constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct( Options_Helper $options_helper, Product_Helper $product_helper ) {
		$this->options_helper = $options_helper;
		$this->product_helper = $product_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_filter( 'admin_menu', [ $this, 'add_submenu_page' ], 9 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'admin_init', [ $this, 'maybe_redirect' ] );
	}

	/**
	 * Redirects to the installation success page if an installation has just occurred.
	 *
	 * @return void
	 */
	public function maybe_redirect() {
		if ( ! $this->options_helper->get( 'should_redirect_after_install_free', false ) ) {
			return;
		}
		$this->options_helper->set( 'should_redirect_after_install_free', false );

		if ( ! empty( $this->options_helper->get( 'activation_redirect_timestamp_free', 0 ) ) ) {
			return;
		}
		$this->options_helper->set( 'activation_redirect_timestamp_free', \time() );

		// phpcs:ignore WordPress.Security.NonceVerification -- This is not a form.
		if ( isset( $_REQUEST['activate-multi'] ) && $_REQUEST['activate-multi'] === 'true' ) {
			return;
		}

		if ( $this->product_helper->is_premium() ) {
			return;
		}

		if ( \is_network_admin() || \is_plugin_active_for_network( WPSEO_BASENAME ) ) {
			return;
		}

		\wp_safe_redirect( \admin_url( 'admin.php?page=wpseo_installation_successful_free' ), 302, 'Yoast SEO' );
		$this->terminate_execution();
	}

	/**
	 * Adds the installation success submenu page.
	 *
	 * @param array $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return array the filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		\add_submenu_page(
			null,
			\__( 'Installation Successful', 'wordpress-seo' ),
			null,
			'manage_options',
			'wpseo_installation_successful_free',
			[ $this, 'render_page' ]
		);

		return $submenu_pages;
	}

	/**
	 * Enqueue assets on the Installation success page.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_installation_successful_free' ) {
			return;
		}

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'installation-success' );
		$asset_manager->enqueue_style( 'installation-success' );
		$asset_manager->enqueue_style( 'monorepo' );

		$yoast_components_l10n = new WPSEO_Admin_Asset_Yoast_Components_L10n();
		$yoast_components_l10n->localize_script( 'installation-success' );

		$asset_manager->localize_script(
			'installation-success',
			'wpseoInstallationSuccess',
			[
				'pluginUrl'                 => \esc_url( \plugins_url( '', WPSEO_FILE ) ),
				'configurationWorkoutUrl'   => \esc_url( \admin_url( 'admin.php?page=wpseo_workouts#configuration' ) ),
				'canDoConfigurationWorkout' => \current_user_can( 'wpseo_manage_options' ),
				'canEditWordPressOptions'   => \current_user_can( 'manage_options' ),
			]
		);
	}

	/**
	 * Renders the installation success page.
	 */
	public function render_page() {
		echo '<div id="wpseo-installation-successful-free" class="yoast"></div>';
	}

	/**
	 * Wrap the `exit` function to make unit testing easier.
	 */
	public function terminate_execution() {
		exit;
	}
}
