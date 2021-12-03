<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Installation_Success_Integration constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
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
		if ( ! $this->options_helper->get( 'should_redirect_after_install_free' ) ) {
			return;
		}
		$this->options_helper->set( 'should_redirect_after_install_free', false );

		if ( ! empty( $this->options_helper->get( 'activation_redirect_timestamp_free' ) ) ) {
			return;
		}
		$this->options_helper->set( 'activation_redirect_timestamp_free', \time() );

		\wp_safe_redirect( \admin_url( 'admin.php?page=wpseo_installation_successful_free' ), 302, 'Yoast SEO' );
		exit;
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
		$asset_manager->enqueue_style( 'monorepo' );
	}

	/**
	 * Renders the installation success page.
	 */
	public function render_page() {
		echo '<div id="wpseo-installation-successful-free" class="yoast"></div>';
	}
}
