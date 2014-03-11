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

	const OPTION_CURRENT_VERSION = 'wpseo_current_version';

	const PLUGIN_VERSION_NAME = '1.0.4';
	const PLUGIN_VERSION_CODE = '5';
	const PLUGIN_AUTHOR       = 'Yoast';
	const EDD_STORE_URL       = 'https://yoast.com';
	const EDD_PLUGIN_NAME     = 'WordPress SEO Premium';

	/**
	 * Function that will be executed when plugin is activated
	 */
	public static function install() {

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

		if ( is_admin() ) {

			// Upgrade Manager
			$plugin_updater = new WPSEO_Upgrade_Manager();
			$plugin_updater->check_update();


			// Initiate GWT class
			WPSEO_GWT::get();

			// Disable WordPress SEO
			add_action( 'admin_init', array( $this, 'disable_wordpress_seo' ), 1 );

			// Add Sub Menu page and add redirect page to admin page array
			// This should be possible in one method in the future, see #535
			add_filter( 'wpseo_submenu_pages', array( $this, 'add_submenu_pages' ) );

			// Add Redirect page as admin page
			add_filter( 'wpseo_admin_pages', array( $this, 'add_admin_pages' ) );

			// Post to Get on search
			add_action( 'admin_init', array( $this, 'list_table_search_post_to_get' ) );

			// Check if WPSEO_DISABLE_PHP_REDIRECTS is defined
			if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {
				// Constant is set, change autoload to off
				WPSEO_Redirect_Manager::redirects_change_autoload( false );
			} else {
				$options = WPSEO_Redirect_Manager::get_options();

				// If the disable_php_redirect option is not enabled we should enable auto loading redirects
				if ( 'off' == $options['disable_php_redirect'] ) {
					WPSEO_Redirect_Manager::redirects_change_autoload( true );
				}
			}

			// Settings
			add_action( 'admin_init', array( $this, 'register_settings' ) );

			// Catch option save
			add_action( 'admin_init', array( $this, 'catch_option_redirect_save' ) );

			// Screen options
			add_filter( 'set-screen-option', array( 'WPSEO_Page_Redirect', 'set_screen_option' ), 10, 3 );
			add_filter( 'set-screen-option', array( 'WPSEO_Page_GWT', 'set_screen_option' ), 10, 3 );

			// Licensing part
			$license_manager = new Yoast_Plugin_License_Manager( new Yoast_Product_WPSEO_Premium() );

			// Setup constant name
			$license_manager->set_license_constant_name( 'WPSEO_LICENSE' );

			// Setup hooks
			$license_manager->setup_hooks();

			// Add this plugin to licensing form
			add_action( 'wpseo_licenses_forms', array( $license_manager, 'show_license_form') );

			if ( $license_manager->license_is_valid() ) {
				add_action( 'admin_head', array( $this, 'admin_css' ) );
			}

		} else {
			// Catch redirect
			add_action( 'template_redirect', array( 'WPSEO_Redirect_Manager', 'do_redirects' ) );
		}

		// AJAX
		add_action( 'wp_ajax_wpseo_save_redirect', array( 'WPSEO_Redirect_Manager', 'ajax_handle_redirect_save' ) );
		add_action( 'wp_ajax_wpseo_delete_redirect', array( 'WPSEO_Redirect_Manager', 'ajax_handle_redirect_delete' ) );
		add_action( 'wp_ajax_wpseo_create_redirect', array( 'WPSEO_Redirect_Manager', 'ajax_handle_redirect_create' ) );
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

			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-gwt-google-client.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-gwt-service.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-gwt.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/pages/class-page-gwt.php' );

			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-crawl-issue.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-crawl-issue-table.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-redirect-file-manager.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-redirect-file.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-nginx-redirect-file.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-apache-redirect-file.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-redirect-table.php' );
			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/pages/class-page-redirect.php' );

			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-premium-javascript-strings.php' );

			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-upgrade-manager.php' );

			require_once( WPSEO_PREMIUM_PATH . 'classes/admin/class-product-wpseo-premium.php' );
		}

	}

	/**
	 * Disable WordPress SEO
	 */
	public function disable_wordpress_seo() {
		if ( is_plugin_active( 'wordpress-seo/wp-seo.php' ) ) {
			deactivate_plugins( 'wordpress-seo/wp-seo.php' );
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
		$submenu_pages[] = array( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Redirects', 'wordpress-seo' ), __( 'Redirects', 'wordpress-seo' ), 'manage_options', 'wpseo_redirects', array( 'WPSEO_Page_Redirect', 'display' ), array( array( 'WPSEO_Page_Redirect', 'page_load' ) ) );
		$submenu_pages[] = array( 'wpseo_dashboard', __( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Webmaster Tools', 'wordpress-seo' ), __( 'Webmaster Tools', 'wordpress-seo' ), 'manage_options', 'wpseo_webmaster_tools', array( 'WPSEO_Page_GWT', 'display' ), array( array( 'WPSEO_Page_GWT', 'page_load' ) ) );

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
		$admin_pages[] = 'wpseo_webmaster_tools';

		return $admin_pages;
	}

	/**
	 * Register the premium settings
	 */
	public function register_settings() {
		register_setting( 'yoast_wpseo_redirect_options', 'wpseo_redirect' );
	}

	/**
	 * Do custom action when the redirect option is saved
	 */
	public function catch_option_redirect_save() {
		if ( isset ( $_POST['option_page'] ) && $_POST['option_page'] == 'yoast_wpseo_redirect_options' ) {
			$enable_autoload = ( isset ( $_POST['wpseo_redirect']['disable_php_redirect'] ) ) ? false : true;
			WPSEO_Redirect_Manager::redirects_change_autoload( $enable_autoload );
		}
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	public function list_table_search_post_to_get() {
		if ( isset( $_POST['s'] ) && trim( $_POST['s'] ) != '' ) {

			// Check if the POST is on one of our pages
			if ( ! isset ( $_GET['page'] ) || ( $_GET['page'] != 'wpseo_redirects' && $_GET['page'] != 'wpseo_webmaster_tools' ) ) {
				return;
			}

			// Check if there isn't a bulk action post, bulk action post > search post
			if ( isset ( $_POST['create_redirects'] ) || isset( $_POST['wpseo_redirects_bulk_delete'] ) ) {
				return;
			}

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

	/**
	 * Output admin css in admin head
	 */
	public function admin_css() {
		echo "<style type='text/css'>#wpseo_content_top{ padding-left: 0; margin-left: 0; }</style>";
	}

}