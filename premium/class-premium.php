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

/**
 * Class WPSEO_Premium
 */
class WPSEO_Premium {

	const OPTION_CURRENT_VERSION = 'wpseo_current_version';

	const PLUGIN_VERSION_NAME = '3.0.6';
	const PLUGIN_VERSION_CODE = '16';
	const PLUGIN_AUTHOR = 'Yoast';
	const EDD_STORE_URL = 'https://yoast.com';
	const EDD_PLUGIN_NAME = 'Yoast SEO Premium';

	/**
	 * Function that will be executed when plugin is activated
	 */
	public static function install() {

		// Load the Redirect File Manager.
		require_once( WPSEO_PREMIUM_PATH . 'classes/class-redirect-file-manager.php' );

		// Create the upload directory.
		WPSEO_Redirect_File_Manager::create_upload_dir();

		WPSEO_Premium::import_redirects_from_free();
	}

	/**
	 * Check if redirects should be imported from the free version
	 */
	public static function import_redirects_from_free() {
		$query_redirects = new WP_Query( 'post_type=any&meta_key=_yoast_wpseo_redirect&order=ASC' );

		if ( ! empty( $query_redirects->posts ) ) {
			WPSEO_Premium::autoloader();

			$redirect_manager = new WPSEO_URL_Redirect_Manager();

			foreach ( $query_redirects->posts as $post ) {
				$old_url = '/' . $post->post_name . '/';
				$new_url = get_post_meta( $post->ID, '_yoast_wpseo_redirect', true );

				// Create redirect.
				$redirect_manager->create_redirect( $old_url, $new_url, 301 );

				// Remove post meta value.
				delete_post_meta( $post->ID, '_yoast_wpseo_redirect' );
			}
		}
	}

	/**
	 * WPSEO_Premium Constructor
	 */
	public function __construct() {
		$this->setup();
	}

	/**
	 * Setup the Yoast SEO premium plugin
	 */
	private function setup() {

		WPSEO_Premium::autoloader();

		$this->load_textdomain();

		$this->instantiate_redirects();

		if ( is_admin() ) {
			$query_var = ( $page = filter_input( INPUT_GET, 'page' ) ) ? $page : '';

			// Only add the helpscout beacon on Yoast SEO pages.
			if ( substr( $query_var, 0, 5 ) === 'wpseo' ) {
				new WPSEO_HelpScout_Beacon( $query_var );
			}

			// Add custom fields plugin to post and page edit pages.
			global $pagenow;
			if ( in_array( $pagenow, array( 'post-new.php', 'post.php', 'edit.php' ) ) ) {
				new WPSEO_Custom_Fields_Plugin();
			}

			// Disable Yoast SEO.
			add_action( 'admin_init', array( $this, 'disable_wordpress_seo' ), 1 );

			// Add Sub Menu page and add redirect page to admin page array.
			// This should be possible in one method in the future, see #535.
			add_filter( 'wpseo_submenu_pages', array( $this, 'add_submenu_pages' ), 9 );

			// Add Redirect page as admin page.
			add_filter( 'wpseo_admin_pages', array( $this, 'add_admin_pages' ) );

			// Post to Get on search.
			add_action( 'admin_init', array( $this, 'list_table_search_post_to_get' ) );

			// Add input fields to page meta post types.
			add_action( 'wpseo_admin_page_meta_post_types', array(
				$this,
				'admin_page_meta_post_types_checkboxes',
			), 10, 2 );

			// Add page analysis fields to variable array key patterns.
			add_filter( 'wpseo_option_titles_variable_array_key_patterns', array(
				$this,
				'add_variable_array_key_pattern',
			) );

			// Settings.
			add_action( 'admin_init', array( $this, 'register_settings' ) );

			// Check if we need to save files after updating options.
			add_action( 'update_option_wpseo_redirect', array( $this, 'save_redirect_files' ), 10, 2 );

			// Catch option save.
			add_action( 'admin_init', array( $this, 'catch_option_redirect_save' ) );

			// Screen options.
			switch ( $query_var ) {
				case 'wpseo_redirects':
					add_filter( 'set-screen-option', array( 'WPSEO_Page_Redirect', 'set_screen_option' ), 11, 3 );
					break;
			}

			// Enqueue Post and Term overview script.
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_overview_script' ) );

			// Licensing part.
			$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );

			// Setup constant name.
			$license_manager->set_license_constant_name( 'WPSEO_LICENSE' );

			// Setup license hooks.
			$license_manager->setup_hooks();

			// Add this plugin to licensing form.
			add_action( 'wpseo_licenses_forms', array( $license_manager, 'show_license_form' ) );

			if ( $license_manager->license_is_valid() ) {
				add_action( 'admin_head', array( $this, 'admin_css' ) );
			}

			// Add Premium imports.
			$premium_import_manager = new WPSEO_Premium_Import_Manager();

			// Allow option of importing from other 'other' plugins.
			add_filter( 'wpseo_import_other_plugins', array(
				$premium_import_manager,
				'filter_add_premium_import_options',
			) );

			// Handle premium imports.
			add_action( 'wpseo_handle_import', array( $premium_import_manager, 'do_premium_imports' ) );

			// Add htaccess import block.
			add_action( 'wpseo_import_tab_content', array( $premium_import_manager, 'add_htaccess_import_block' ) );
			add_action( 'wpseo_import_tab_header', array( $premium_import_manager, 'htaccess_import_header' ) );

			// Only activate post and term watcher if permalink structure is enabled.
			if ( get_option( 'permalink_structure' ) ) {
				add_action( 'admin_init', array( $this, 'init_watchers' ) );

				// Check if we need to display an admin message.
				if ( $redirect_created = filter_input( INPUT_GET, 'yoast-redirect-created' ) ) {

					// Message object.
					$message = new WPSEO_Message_Redirect_Created( $redirect_created );
					add_action( 'all_admin_notices', array( $message, 'display' ) );
				}
			}
		}
		else {
			// Add 404 redirect link to WordPress toolbar.
			add_action( 'admin_bar_menu', array( $this, 'admin_bar_menu' ), 96 );

			add_filter( 'redirect_canonical', array( $this, 'redirect_canonical_fix' ), 1, 2 );
		}

		add_action( 'admin_init', array( $this, 'enqueue_multi_keyword' ) );
	}

	/**
	 * Initialize the watchers for the posts and the terms
	 */
	public function init_watchers() {
		// The Post Watcher.
		new WPSEO_Post_Watcher();

		// The Term Watcher.
		new WPSEO_Term_Watcher();
	}

	/**
	 * Adds multi keyword functionality if we are on the correct pages
	 */
	public function enqueue_multi_keyword() {
		global $pagenow;
		if ( in_array( $pagenow, array(
				'post-new.php',
			'post.php',
			'edit.php',
			), true ) ) {
			new WPSEO_Multi_Keyword();
		}
	}

	/**
	 * Instantiate all the needed redirect functions
	 */
	private function instantiate_redirects() {
		$normal_redirect_manager = new WPSEO_URL_Redirect_Manager();
		$regex_redirect_manager  = new WPSEO_REGEX_Redirect_Manager();

		if ( is_admin() ) {
			// Check if WPSEO_DISABLE_PHP_REDIRECTS is defined.
			if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {

				// Change the normal redirect autoload option.
				$normal_redirect_manager->redirects_change_autoload( false );

				// Change the regex redirect autoload option.
				$regex_redirect_manager->redirects_change_autoload( false );

			}
			else {
				$options = WPSEO_Redirect_Manager::get_options();

				// If the disable_php_redirect option is not enabled we should enable auto loading redirects.
				if ( 'off' == $options['disable_php_redirect'] ) {
					// Change the normal redirect autoload option.
					$normal_redirect_manager->redirects_change_autoload( true );

					// Change the regex redirect autoload option.
					$regex_redirect_manager->redirects_change_autoload( true );
				}
			}
		}
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			// Normal Redirect AJAX.
			add_action( 'wp_ajax_wpseo_save_redirect_url', array(
				$normal_redirect_manager,
				'ajax_handle_redirect_save',
			) );
			add_action( 'wp_ajax_wpseo_delete_redirect_url', array(
				$normal_redirect_manager,
				'ajax_handle_redirect_delete',
			) );
			add_action( 'wp_ajax_wpseo_create_redirect_url', array(
				$normal_redirect_manager,
				'ajax_handle_redirect_create',
			) );

			// Regex Redirect AJAX.
			add_action( 'wp_ajax_wpseo_save_redirect_regex', array(
				$regex_redirect_manager,
				'ajax_handle_redirect_save',
			) );
			add_action( 'wp_ajax_wpseo_delete_redirect_regex', array(
				$regex_redirect_manager,
				'ajax_handle_redirect_delete',
			) );
			add_action( 'wp_ajax_wpseo_create_redirect_regex', array(
				$regex_redirect_manager,
				'ajax_handle_redirect_create',
			) );

			// Add URL reponse code check AJAX.
			add_action( 'wp_ajax_wpseo_check_url', array( 'WPSEO_Url_Checker', 'check_url' ) );
		}
		else {
			// Catch redirect.
			add_action( 'template_redirect', array( $normal_redirect_manager, 'do_redirects' ), - 999 );

			// Catch regex redirects.
			add_action( 'template_redirect', array( $regex_redirect_manager, 'do_redirects' ), - 999 );
		}
	}

	/**
	 * Hooks into the `redirect_canonical` filter to catch ongoing redirects and move them to the correct spot
	 *
	 * @param string $redirect_url  The target url where the requested url will be redirected to.
	 * @param string $requested_url The current requested url.
	 *
	 * @return string
	 */
	function redirect_canonical_fix( $redirect_url, $requested_url ) {
		$redirects = apply_filters( 'wpseo_premium_get_redirects', get_option( 'wpseo-premium-redirects', array() ) );
		$path      = parse_url( $requested_url, PHP_URL_PATH );
		if ( isset( $redirects[ $path ] ) ) {
			$redirect_url = $redirects[ $path ]['url'];
			if ( '/' === substr( $redirect_url, 0, 1 ) ) {
				$redirect_url = home_url( $redirect_url );
			}
			wp_redirect( $redirect_url, $redirects[ $path ]['type'] );
			exit;
		}
		else {
			return $redirect_url;
		}
	}

	/**
	 * Disable Yoast SEO
	 */
	public function disable_wordpress_seo() {
		if ( is_plugin_active( 'wordpress-seo/wp-seo.php' ) ) {
			deactivate_plugins( 'wordpress-seo/wp-seo.php' );
		}
	}

	/**
	 * Enqueue post en term overview script
	 *
	 * @param string $hook The current opened page.
	 */
	public function enqueue_overview_script( $hook ) {
		if ( 'edit.php' == $hook || 'edit-tags.php' == $hook || 'post.php' == $hook ) {
			self::enqueue();
		}

	}

	/**
	 * Enqueues the do / undo redirect scripts
	 */
	public static function enqueue() {
		wp_enqueue_script( 'wpseo-premium-admin-overview', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wpseo-premium-admin-overview' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		wp_localize_script( 'wpseo-premium-admin-overview', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );
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
					$old_url .= '?' . $parsed_url['query'];
				}

				$old_url = urlencode( $old_url );

				$wp_admin_bar->add_menu( array(
					'id'    => 'wpseo-premium-create-redirect',
					'title' => __( 'Create Redirect', 'wordpress-seo-premium' ),
					'href'  => admin_url( 'admin.php?page=wpseo_redirects&old_url=' . $old_url ),
				) );
			}
		}
	}

	/**
	 * Add page analysis to array with variable array key patterns
	 *
	 * @param array $patterns Array with patterns for page analysis.
	 *
	 * @return array
	 */
	public function add_variable_array_key_pattern( $patterns ) {
		if ( true !== in_array( 'page-analyse-extra-', $patterns ) ) {
			$patterns[] = 'page-analyse-extra-';
		}

		return $patterns;
	}

	/**
	 * This hook will add an input-field for specifying custom fields for page analysis.
	 *
	 * The values will be comma-seperated and will target the belonging field in the post_meta. Page analysis will
	 * use the content of it by sticking it to the post_content.
	 *
	 * @param array  $wpseo_admin_pages Unused. Array with admin pages.
	 * @param string $name				The name for the text input field.
	 */
	public function admin_page_meta_post_types_checkboxes( $wpseo_admin_pages, $name ) {
		echo Yoast_Form::get_instance()->textinput( 'page-analyse-extra-' . $name, __( 'Add custom fields to page analysis', 'wordpress-seo-premium' ) );
	}

	/**
	 * Function adds the premium pages to the Yoast SEO menu
	 *
	 * @param array $submenu_pages Array with the configuration for the submenu pages.
	 *
	 * @return array
	 */
	public function add_submenu_pages( $submenu_pages ) {
		/**
		 * Filter: 'wpseo_premium_manage_redirects_role' - Change the minimum rule to access and change the site redirects
		 *
		 * @api string manage_options
		 */
		$submenu_pages[] = array(
			'wpseo_dashboard',
			'',
			__( 'Redirects', 'wordpress-seo-premium' ),
			apply_filters( 'wpseo_premium_manage_redirects_role', 'manage_options' ),
			'wpseo_redirects',
			array( 'WPSEO_Page_Redirect', 'display' ),
			array( array( 'WPSEO_Page_Redirect', 'page_load' ) ),
		);

		$submenu_pages[] = array(
			'wpseo_dashboard',
			'',
			__( 'Video Tutorials', 'wordpress-seo-premium' ),
			'edit_posts',
			'wpseo_tutorial_videos',
			array( 'WPSEO_Tutorial_Videos', 'display' ),
		);

		return $submenu_pages;
	}

	/**
	 * Add redirects to admin pages so the Yoast scripts are loaded
	 *
	 * @param array $admin_pages Array with the admin pages.
	 *
	 * @return array
	 */
	public function add_admin_pages( $admin_pages ) {
		$admin_pages[] = 'wpseo_redirects';
		$admin_pages[] = 'wpseo_tutorial_videos';

		return $admin_pages;
	}

	/**
	 * Register the premium settings
	 */
	public function register_settings() {
		register_setting( 'yoast_wpseo_redirect_options', 'wpseo_redirect' );
	}

	/**
	 * Hook that runs after the 'wpseo_redirect' option is updated
	 *
	 * @param array $old_value The current redirect option values.
	 * @param array $value     The new redirect option values.
	 */
	public function save_redirect_files( $old_value, $value ) {

		// Check if we need to remove the WPSEO redirect entries from the .htacccess file.
		$remove_htaccess_entries = false;

		// Check if the 'disable_php_redirect' option set to true/on.
		if ( null != $value && isset( $value['disable_php_redirect'] ) && 'on' == $value['disable_php_redirect'] ) {

			// Remove .htaccess entries if the 'separate_file' option is set to true.
			if ( WPSEO_Utils::is_apache() && isset( $value['separate_file'] ) && 'on' == $value['separate_file'] ) {
				$remove_htaccess_entries = true;
			}

			// The 'disable_php_redirect' option is set to true(on) so we need to generate a file.
			// The Redirect Manager will figure out what file needs to be created.
			$redirect_manager = new WPSEO_URL_Redirect_Manager();
			$redirect_manager->save_redirect_file();

		}
		else if ( WPSEO_Utils::is_apache() ) {
			// No settings are set so we should also strip the .htaccess redirect entries in this case.
			$remove_htaccess_entries = true;
		}

		// Check if we need to remove the .htaccess redirect entries.
		if ( $remove_htaccess_entries ) {
			// Remove the .htaccess redirect entries.
			$redirect_manager = new WPSEO_URL_Redirect_Manager();
			$redirect_manager->clear_htaccess_entries();
		}

	}

	/**
	 * Do custom action when the redirect option is saved
	 */
	public function catch_option_redirect_save() {
		if ( filter_input( INPUT_POST, 'option_page' ) === 'yoast_wpseo_redirect_options' ) {
			if ( current_user_can( 'manage_options' ) ) {
				$wpseo_redirect  = filter_input( INPUT_POST, 'wpseo_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
				$enable_autoload = ( ! empty( $wpseo_redirect['disable_php_redirect'] ) ) ? false : true;

				// Change the normal redirect autoload option.
				$normal_redirect_manager = new WPSEO_URL_Redirect_Manager();
				$normal_redirect_manager->redirects_change_autoload( $enable_autoload );

				// Change the regex redirect autoload option.
				$regex_redirect_manager = new WPSEO_REGEX_Redirect_Manager();
				$regex_redirect_manager->redirects_change_autoload( $enable_autoload );
			}
		}
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	public function list_table_search_post_to_get() {
		if ( ( $search_string = trim( filter_input( INPUT_POST, 's' ) ) ) != '' ) {

			// Check if the POST is on one of our pages.
			$current_page = filter_input( INPUT_GET, 'page' );
			if ( ! in_array( $current_page, array( 'wpseo_redirects' ) )  ) {
				return;
			}

			// Check if there isn't a bulk action post, bulk action post > search post.
			if ( filter_input( INPUT_POST, 'create_redirects' ) || filter_input( INPUT_POST, 'wpseo_redirects_bulk_delete' ) ) {
				return;
			}

			// Base URL.
			$url = get_admin_url() . 'admin.php?page=' . $current_page;

			// Add search or reset it.
			$url .= '&s=' . $search_string;

			// Orderby.
			if ( $orderby = filter_input( INPUT_GET, 'orderby' ) ) {
				$url .= '&orderby=' . $orderby;
			}

			// Order.
			if ( $order = filter_input( INPUT_GET, 'order' ) ) {
				$url .= '&order=' . $order;
			}

			// Do the redirect.
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

	/**
	 * Load textdomain
	 */
	private function load_textdomain() {
		load_plugin_textdomain( 'wordpress-seo-premium', false, dirname( plugin_basename( WPSEO_FILE ) ) . '/premium/languages/' );
	}

	/**
	 * Loads the autoloader
	 */
	private static function autoloader() {

		if ( ! class_exists( 'WPSEO_Premium_Autoloader', false ) ) {
			// Setup autoloader.
			require_once( dirname( __FILE__ ) . '/classes/class-premium-autoloader.php' );
			$autoloader = new WPSEO_Premium_Autoloader();
			spl_autoload_register( array( $autoloader, 'load' ) );
		}
	}
}
