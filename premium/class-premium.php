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
	 * Function that will be executed when plugin is activated
	 */
	public static function install() {

		// Check if WordPress SOE is installed and activated
		if ( is_plugin_active( 'wordpress-seo/wp-seo.php' ) ) {
			deactivate_plugins( 'wordpress-seo/wp-seo.php' );
		}

		// Load the Redirect File Manager
		require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-redirect-file-manager.php' );

		// Create the upload directory
		WPSEO_Redirect_File_Manager::create_upload_dir();
	}

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

		// Add Sub Menu page and add redirect page to admin page array
		// This should be possible in one method in the future, see #535
		add_filter( 'wpseo_submenu_pages', array( $this, 'add_submenu_pages' ) );

		// Add Redirect page as admin page
		add_filter( 'wpseo_admin_pages', array( $this, 'add_admin_pages' ) );

		// Catch redirect
		add_action( 'template_redirect', array( 'WPSEO_Redirect_Manager', 'do_redirects' ) );

		// Post to Get on search
		add_action( 'admin_init', array( $this, 'redirects_search_post_to_get' ) );

		// Screen options
		add_filter( 'set-screen-option', array( 'WPSEO_Page_Redirect', 'set_screen_option' ), 10, 3 );

		// Settings
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// AJAX
		add_action( 'wp_ajax_wpseo_save_redirect', array( 'WPSEO_Redirect_Manager', 'ajax_handle_redirect_save' ) );
		add_action( 'wp_ajax_wpseo_delete_redirect', array( 'WPSEO_Redirect_Manager', 'ajax_handle_redirect_delete' ) );
		add_action( 'wp_ajax_wpseo_create_redirect', array( 'WPSEO_Redirect_Manager', 'ajax_handle_redirect_create' ) );

		// TESTING
		add_action( 'admin_init', function () {
			if ( isset( $_GET['test_redirect'] ) ) {
//				$apache_file = new WPSEO_Apache_Redirect_File();
				$apache_file = new WPSEO_Nginx_Redirect_File();
				$apache_file->save_file();
				exit;
			}
		} );
	}

	/**
	 * Include all required files
	 *
	 * This will be removed once the autoloader is created
	 */
	private function includes() {

		// General includes
		require_once( WPSEO_PREMIUM_PATH . 'classes/general/class-redirect-manager.php' );

		// Separate backend and frontend files
		if ( is_admin() ) {
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-redirect-file-manager.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-redirect-file.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-nginx-redirect-file.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-apache-redirect-file.php' );
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

	/**
	 * Add redirects to admin pages so the Yoast scripts are loaded
	 *
	 * @param $admin_pages
	 *
	 * @return array
	 */
	public function add_admin_pages( $admin_pages ) {
		$admin_pages[] = 'wpseo_redirects';

		return $admin_pages;
	}

	/**
	 * Register the premium settings
	 */
	public function register_settings() {
		register_setting( 'yoast_wpseo_redirect_options', 'wpseo_redirect' );
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	public function redirects_search_post_to_get() {
		if ( isset( $_POST['s'] ) ) {

			// Base URL
			$url = get_admin_url() . 'admin.php?page=' . $_GET['page'];

			// Add search or reset it
			if ( $_POST['s'] != '' ) {
				$url .= '&s=' . $_POST['s'];
			}


			// Orderby
			if ( isset( $_GET['orderby'] ) ) {
				$url .= '&orderby=' . $_GET['orderby'];
			}

			// Order
			if ( isset( $_GET['order'] ) ) {
				$url .= '&order=' . $_GET['order'];
			}

			// Do the redirect
			wp_redirect( $url );
			exit;
		}
	}

}

// Load the WordPress SEO Premium class the correct way, which is later than the WordPress SEO priority
add_action( 'plugins_loaded', create_function( '', 'new WPSEO_Premium();' ), 15 );