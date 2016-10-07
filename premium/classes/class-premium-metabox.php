<?php
/**
 * @package WPSEO\Premium|Classes
 */

/**
 * The metabox for premium
 */
class WPSEO_Premium_Metabox {

	/**
	 * Registers relevant hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this, 'register_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Registers assets to WordPress
	 */
	public function register_assets() {
		wp_register_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/dist/wp-seo-premium-metabox-360' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery', 'wp-util', 'underscore' ), WPSEO_VERSION );
		wp_register_style( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/css/dist/premium-metabox-331' . WPSEO_CSSJS_SUFFIX . '.css', array(), WPSEO_VERSION );
	}

	/**
	 * Enqueues assets when relevant
	 */
	public function enqueue_assets() {
		if ( WPSEO_Metabox::is_post_edit( $GLOBALS['pagenow'] ) ) {
			wp_enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox' );
			wp_enqueue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox' );
		}
	}
}
