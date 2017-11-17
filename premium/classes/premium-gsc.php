<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Registers the premium WordPress implementation of Google Search Console
 */
class WPSEO_Premium_GSC implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
	}

	/**
	 * Enqueues site wide analysis script
	 */
	public function enqueue() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$version       = $asset_manager->flatten_version( WPSEO_VERSION );

		$page = filter_input( INPUT_GET, 'page' );

		wp_register_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-gsc', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/dist/yoast-premium-gsc-' . $version . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION, true );

		if ( $page !== 'wpseo_search_console' ) {
			return;
		}

		$data = array(
			'restAPI' => array(
				'root'  => esc_url_raw( rest_url() ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			),
		);

		wp_enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-gsc' );
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-gsc', 'yoastPremiumGSC', array( 'data' => $data ) );
	}
}
