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

	const PLUGIN_VERSION_NAME = '1.2.0-beta1';
	const PLUGIN_VERSION_CODE = '13';
	const PLUGIN_AUTHOR = 'Yoast';
	const EDD_STORE_URL = 'https://yoast.com';
	const EDD_PLUGIN_NAME = 'WordPress SEO Premium';

	private $page_gwt = null;

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
//		$this->includes();
		$this->setup();
	}

	/**
	 * Setup the premium WordPress SEO plugin
	 */
	private function setup() {

		// Setup autoloader
		require_once( dirname( __FILE__ ) . '/classes/class-premium-autoloader.php' );
		$autoloader = new WPSEO_Premium_Autoloader();
		spl_autoload_register( array( $autoloader, 'load' ) );

		if ( is_admin() ) {

			// Upgrade Manager
			$plugin_updater = new WPSEO_Upgrade_Manager();
			$plugin_updater->check_update();


			// Create pages
			$this->page_gwt = new WPSEO_Page_GWT();

			// Disable WordPress SEO
			add_action( 'admin_init', array( $this, 'disable_wordpress_seo' ), 1 );

			// Add Sub Menu page and add redirect page to admin page array
			// This should be possible in one method in the future, see #535
			add_filter( 'wpseo_submenu_pages', array( $this, 'add_submenu_pages' ) );

			// Add Redirect page as admin page
			add_filter( 'wpseo_admin_pages', array( $this, 'add_admin_pages' ) );

			// Post to Get on search
			add_action( 'admin_init', array( $this, 'list_table_search_post_to_get' ) );

			// Add the GWT crawl error post type
			add_action( 'admin_init', array( $this, 'register_gwt_crawl_error_post_type' ) );

			// Check if WPSEO_DISABLE_PHP_REDIRECTS is defined
			if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {

				// Change the normal redirect autoload option
				$normal_redirect_manager = new WPSEO_URL_Redirect_Manager();
				$normal_redirect_manager->redirects_change_autoload( false );

				// Change the regex redirect autoload option
				$regex_redirect_manager = new WPSEO_REGEX_Redirect_Manager();
				$regex_redirect_manager->redirects_change_autoload( false );

			} else {
				$options = WPSEO_Redirect_Manager::get_options();

				// If the disable_php_redirect option is not enabled we should enable auto loading redirects
				if ( 'off' == $options['disable_php_redirect'] ) {

					// Change the normal redirect autoload option
					$normal_redirect_manager = new WPSEO_URL_Redirect_Manager();
					$normal_redirect_manager->redirects_change_autoload( true );

					// Change the regex redirect autoload option
					$regex_redirect_manager = new WPSEO_REGEX_Redirect_Manager();
					$regex_redirect_manager->redirects_change_autoload( true );

				}
			}

			// Settings
			add_action( 'admin_init', array( $this, 'register_settings' ) );

			// Catch option save
			add_action( 'admin_init', array( $this, 'catch_option_redirect_save' ) );

			// Screen options
			add_filter( 'set-screen-option', array( 'WPSEO_Page_Redirect', 'set_screen_option' ), 11, 3 );
			add_filter( 'set-screen-option', array( $this->page_gwt, 'set_screen_option' ), 11, 3 );

			// Enqueue Post and Term overview script
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_overview_script' ) );

			// Licensing part
			$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );

			// Setup constant name
			$license_manager->set_license_constant_name( 'WPSEO_LICENSE' );

			// Setup license hooks
			$license_manager->setup_hooks();

			// Add this plugin to licensing form
			add_action( 'wpseo_licenses_forms', array( $license_manager, 'show_license_form' ) );

			if ( $license_manager->license_is_valid() ) {
				add_action( 'admin_head', array( $this, 'admin_css' ) );
			}

			// Crawl Issue Manager AJAX hooks
			$crawl_issue_manager = new WPSEO_Crawl_Issue_Manager();
			add_action( 'wp_ajax_wpseo_ignore_crawl_issue', array( $crawl_issue_manager, 'ajax_ignore_crawl_issue' ) );
			add_action( 'wp_ajax_wpseo_unignore_crawl_issue', array(
				$crawl_issue_manager,
				'ajax_unignore_crawl_issue'
			) );

			// Add Premium imports
			$premium_import_manager = new WPSEO_Premium_Import_Manager();

			// Allow option of importing from other 'other' plugins
			add_filter( 'wpseo_import_other_plugins', array(
				$premium_import_manager,
				'filter_add_premium_import_options'
			) );

			// Handle premium imports
			add_action( 'wpseo_handle_import', array( $premium_import_manager, 'do_premium_imports' ) );

			// Add htaccess import block
			add_action( 'wpseo_import', array( $premium_import_manager, 'add_htaccess_import_block' ) );

			// Only activate post watcher if permalink structure is enabled
			if ( get_option( 'permalink_structure' ) ) {

				// The Post Watcher
				$post_watcher = new WPSEO_Post_Watcher();

				// Add old URL field to post edit screen
				add_action( 'edit_form_advanced', array( $post_watcher, 'old_url_field' ), 10, 1 );
				add_action( 'edit_page_form', array( $post_watcher, 'old_url_field' ), 10, 1 );

				// Detect a post slug change
				add_action( 'post_updated', array( $post_watcher, 'detect_slug_change' ), 12, 3 );

				// Detect a post delete
				add_action( 'delete_post', array( $post_watcher, 'detect_post_delete' ) );

				// The Term Watcher
				$term_watcher = new WPSEO_Term_Watcher();

				// Get all taxonomies
				$taxonomies = get_taxonomies();

				// Loop through all taxonomies
				if ( count( $taxonomies ) > 0 ) {
					foreach ( $taxonomies as $taxonomy ) {
						// Add old URL field to term edit screen
						add_action( $taxonomy . '_edit_form_fields', array( $term_watcher, 'old_url_field' ), 10, 2 );
					}
				}

				// Detect the term slug change
				add_action( 'edited_term', array( $term_watcher, 'detect_slug_change' ), 10, 3 );

				// Detect a term delete
				add_action( 'delete_term_taxonomy', array( $term_watcher, 'detect_term_delete' ) );

				// Check if we need to display an admin message
				if ( isset( $_GET['yoast-redirect-created'] ) ) {

					// Message object
					$message = new WPSEO_Message_Redirect_Created( $_GET['yoast-redirect-created'] );
					add_action( 'all_admin_notices', array( $message, 'display' ) );

				}

			}


		} else {
			// Catch redirect
			$normal_redirect_manager = new WPSEO_URL_Redirect_Manager();
			add_action( 'template_redirect', array( $normal_redirect_manager, 'do_redirects' ) );

			// Catch redirect
			$regex_redirect_manager = new WPSEO_REGEX_Redirect_Manager();
			add_action( 'template_redirect', array( $regex_redirect_manager, 'do_redirects' ) );

			// Add 404 redirect link to WordPress toolbar
			add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu' ), 96 );
		}

		// Normal Redirect AJAX
		$redirect_manager = new WPSEO_URL_Redirect_Manager();
		add_action( 'wp_ajax_wpseo_save_redirect_url', array( $redirect_manager, 'ajax_handle_redirect_save' ) );
		add_action( 'wp_ajax_wpseo_delete_redirect_url', array( $redirect_manager, 'ajax_handle_redirect_delete' ) );
		add_action( 'wp_ajax_wpseo_create_redirect_url', array( $redirect_manager, 'ajax_handle_redirect_create' ) );

		// Regex Redirect AJAX
		$redirect_manager = new WPSEO_REGEX_Redirect_Manager();
		add_action( 'wp_ajax_wpseo_save_redirect_regex', array( $redirect_manager, 'ajax_handle_redirect_save' ) );
		add_action( 'wp_ajax_wpseo_delete_redirect_regex', array( $redirect_manager, 'ajax_handle_redirect_delete' ) );
		add_action( 'wp_ajax_wpseo_create_redirect_regex', array( $redirect_manager, 'ajax_handle_redirect_create' ) );
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
	 * Enqueue post en term overview script
	 *
	 * @param $hook
	 */
	public function enqueue_overview_script( $hook ) {

		if ( 'edit.php' == $hook || 'edit-tags.php' == $hook || 'post.php' == $hook ) {
			wp_enqueue_script( 'wpseo-premium-admin-overview', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wpseo-premium-admin-overview.js', array( 'jquery' ), '1.0.0' );
			wp_localize_script( 'wpseo-premium-admin-overview', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );
		}

	}

	/**
	 * Add 'Create Redirect' option to admin bar menu on 404 pages
	 */
	public function admin_bar_menu() {

		if ( is_404() ) {
			global $wp, $wp_admin_bar;

			$parsed_url = parse_url( home_url( add_query_arg( null, null ) ) );

			if ( false !== $parsed_url ) {
				$old_url = $parsed_url['path'];

				if ( isset( $parsed_url['query'] ) && $parsed_url['query'] != '' ) {
					$old_url .= "?" . $parsed_url['query'];
				}

				$old_url = urlencode( $old_url );

				$wp_admin_bar->add_menu( array(
					'id'    => 'wpseo-premium-create-redirect',
					'title' => __( 'Create Redirect', 'wordpress-seo' ),
					'href'  => admin_url( 'admin.php?page=wpseo_redirects&old_url=' . $old_url )
				) );
			}

		}
	}

	/**
	 * Register the GWT Crawl Error post type
	 */
	public function register_gwt_crawl_error_post_type() {
		register_post_type( WPSEO_Crawl_Issue_Manager::PT_CRAWL_ISSUE, array(
			'public' => false,
			'label'  => 'WordPress SEO GWT Crawl Error'
		) );
	}

	/**
	 * Function adds the premium pages to the WordPress SEO menu
	 *
	 * @param $submenu_pages
	 *
	 * @return array
	 */
	public function add_submenu_pages( $submenu_pages ) {
		$submenu_pages[] = array(
			'wpseo_dashboard',
			__( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Redirects', 'wordpress-seo' ),
			__( 'Redirects', 'wordpress-seo' ),
			'manage_options',
			'wpseo_redirects',
			array( 'WPSEO_Page_Redirect', 'display' ),
			array( array( 'WPSEO_Page_Redirect', 'page_load' ) )
		);
		$submenu_pages[] = array(
			'wpseo_dashboard',
			__( 'Yoast WordPress SEO:', 'wordpress-seo' ) . ' ' . __( 'Webmaster Tools', 'wordpress-seo' ),
			__( 'Webmaster Tools', 'wordpress-seo' ),
			'manage_options',
			'wpseo_webmaster_tools',
			array( $this->page_gwt, 'display' ),
			array( array( $this->page_gwt, 'page_load' ) )
		);

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
		register_setting( 'yoast_wpseo_gwt_options', 'wpseo-premium-gwt', array( $this, 'gwt_sanatize_callback' ) );
	}

	/**
	 * Remove the last check timestamp if the profile is switched
	 *
	 * @param $setting
	 *
	 * @return mixed
	 */
	public function gwt_sanatize_callback( $setting ) {
		$crawl_issue_manager = new WPSEO_Crawl_Issue_Manager();

		// Remove last check if new profile is selected
		if ( $crawl_issue_manager->get_profile() != $setting['profile'] ) {
			$crawl_issue_manager->remove_last_checked();
		}

		return $setting;
	}

	/**
	 * Do custom action when the redirect option is saved
	 */
	public function catch_option_redirect_save() {
		if ( isset ( $_POST['option_page'] ) && $_POST['option_page'] == 'yoast_wpseo_redirect_options' ) {
			$enable_autoload = ( isset ( $_POST['wpseo_redirect']['disable_php_redirect'] ) ) ? false : true;

			// Change the normal redirect autoload option
			$normal_redirect_manager = new WPSEO_URL_Redirect_Manager();
			$normal_redirect_manager->redirects_change_autoload( $enable_autoload );

			// Change the regex redirect autoload option
			$regex_redirect_manager = new WPSEO_REGEX_Redirect_Manager();
			$regex_redirect_manager->redirects_change_autoload( $enable_autoload );

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