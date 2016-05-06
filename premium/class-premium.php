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

	const PLUGIN_VERSION_NAME = '3.2.5';
	const PLUGIN_VERSION_CODE = '16';
	const PLUGIN_AUTHOR = 'Yoast';
	const EDD_STORE_URL = 'http://yoast.com';
	const EDD_PLUGIN_NAME = 'Yoast SEO Premium';

	/**
	 * @var WPSEO_Redirect_Page
	 */
	private $redirects;

	/**
	 * Function that will be executed when plugin is activated
	 */
	public static function install() {

		// Load the Redirect File Manager.
		require_once( WPSEO_PREMIUM_PATH . 'classes/redirect/class-redirect-file-util.php' );

		// Create the upload directory.
		WPSEO_Redirect_File_Util::create_upload_dir();

		WPSEO_Premium::activate_license();
	}

	/**
	 * Creates instance of license manager if needed and returns the instance of it.
	 *
	 * @return Yoast_Plugin_License_Manager
	 */
	public static function get_license_manager() {
		static $license_manager;

		if ( $license_manager === null ) {
			$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );
		}

		return $license_manager;
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

		$this->redirect_setup();

		if ( is_admin() ) {
			add_action( 'admin_init', array( $this, 'init_beacon' ) );

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

			// Enqueue Post and Term overview script.
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_overview_script' ) );

			// Licensing part.
			$license_manager = WPSEO_Premium::get_license_manager();

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
			new WPSEO_Premium_Import_Manager();

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

			$dublin_core = new WPSEO_Dublin_Core();
		}

		add_action( 'admin_init', array( $this, 'enqueue_multi_keyword' ) );
		add_action( 'admin_init', array( $this, 'enqueue_social_previews' ) );
	}

	/**
	 * Setting the autoloader for the redirects and instantiate the redirect page object
	 */
	private function redirect_setup() {
		// Setting the autoloader for redirects.
		new WPSEO_Premium_Autoloader( 'WPSEO_Redirect', 'redirect/', 'WPSEO_' );

		$this->redirects = new WPSEO_Redirect_Page();
	}

	/**
	 * We might want to reactivate the license.
	 */
	private static function activate_license() {
		$license_manager = self::get_license_manager();
		$license_manager->activate_license();
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
	 * Adds multi keyword functionality if we are on the correct pages
	 */
	public function enqueue_social_previews() {
		global $pagenow;

		$metabox_pages = array(
			'post-new.php',
			'post.php',
			'edit.php',
		);

		$social_previews = new WPSEO_Social_Previews();
		if ( in_array( $pagenow , $metabox_pages, true ) || WPSEO_Taxonomy::is_term_edit( $pagenow ) ) {
			$social_previews->set_hooks();
		}
		$social_previews->set_ajax_hooks();
	}

	/**
	 * Hooks into the `redirect_canonical` filter to catch ongoing redirects and move them to the correct spot
	 *
	 * @param string $redirect_url  The target url where the requested URL will be redirected to.
	 * @param string $requested_url The current requested URL.
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

		return $redirect_url;
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
			array( $this->redirects, 'display' ),
		);

		return $submenu_pages;
	}

	/**
	 * Add redirects to admin pages so the Yoast scripts are loaded
	 *
	 * @param array $admin_pages Array with the admin pages.
	 *
	 * @return array
	 * @deprecated 3.1
	 */
	public function add_admin_pages( $admin_pages ) {
		_deprecated_function( 'WPSEO_Premium::add_admin_pages', 'WPSEO 3.1' );
		return $admin_pages;
	}

	/**
	 * Register the premium settings
	 */
	public function register_settings() {
		register_setting( 'yoast_wpseo_redirect_options', 'wpseo_redirect' );
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
	public static function autoloader() {

		if ( ! class_exists( 'WPSEO_Premium_Autoloader', false ) ) {
			// Setup autoloader.
			require_once( dirname( __FILE__ ) . '/classes/class-premium-autoloader.php' );
			$autoloader = new WPSEO_Premium_Autoloader( 'WPSEO_', '' );
		}
	}

	/**
	 * Initializes beacon
	 */
	public function init_beacon() {
		$query_var = ( $page = filter_input( INPUT_GET, 'page' ) ) ? $page : '';

		// Only add the helpscout beacon on Yoast SEO pages.
		if ( substr( $query_var, 0, 5 ) === 'wpseo' ) {
			$beacon = yoast_get_helpscout_beacon( $query_var );
			$beacon->add_setting( new WPSEO_Premium_Beacon_Setting() );
			$beacon->register_hooks();
		}
	}
}
