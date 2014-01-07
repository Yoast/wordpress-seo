<?php
/**
 * @package Premium
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( ! defined( 'WPSEO_PREMIUM_PATH' ) ) {
	define( 'WPSEO_PREMIUM_PATH', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'WPSEO_PREMIUM_FILE' ) ) {
	define( 'WPSEO_PREMIUM_FILE', __FILE__ );
}


class WPSEO_Premium {

	/**
	 * WPSEO_Premium Constructor
	 */
	public function __construct() {
		$this->includes();
		$this->setup();
	}

	/**
	 * Setup the premium WordPress SEO plugin
	 */
	private function setup() {
		// Sub Menu pages
		add_filter( 'wpseo_submenu_pages', array( $this, 'add_submenu_pages' ) );

		// AJAX
		add_action( 'wp_ajax_wpseo_save_redirects', array( 'WPSEO_Redirect_Manager', 'ajax_handle_redirects_save' ) );
	}

	/**
	 * Include all required files
	 */
	private function includes() {

		// General includes
		require_once( WPSEO_PREMIUM_PATH . 'classes/general/class-redirect-manager.php' );

		// Separate backend and frontend files
		if ( is_admin() ) {
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-redirect-table.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/pages/class-page-redirect.php' );
		} else {

		}

	}

	/**
	 * Function adds the premium pages to the WordPress SEO menu
	 *
	 * @param $submenu_pages
	 *
	 * @return array
	 */
	public function add_submenu_pages( $submenu_pages ) {
		$submenu_pages[] = array( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Redirects', 'wordpress-seo' ), __( 'Redirects', 'wordpress-seo' ), 'manage_options', 'wpseo_redirects', array( WPSEO_Page_Redirect, 'display' ), array( array( 'WPSEO_Page_Redirect', 'page_load' ) ) );

		return $submenu_pages;
	}

}

// Load the WordPress SEO Premium class the correct way, that is later then the WordPress SEO priority
add_action( 'plugins_loaded', create_function( '', 'new WPSEO_Premium();' ), 15 );