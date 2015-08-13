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

	const PLUGIN_VERSION_NAME = '2.3.2';
	const PLUGIN_VERSION_CODE = '16';
	const PLUGIN_AUTHOR = 'Yoast';
	const EDD_STORE_URL = 'https://yoast.com';
	const EDD_PLUGIN_NAME = 'Yoast SEO Premium';

	/**
	 * @var WPSEO_Redirect
	 */
	private $redirects;

	/**
	 * Function that will be executed when plugin is activated
	 */
	public static function install() {

		// Load the Redirect File Manager.
		require_once( WPSEO_PREMIUM_PATH . 'classes/class-redirect-file-manager.php' );

		// Create the upload directory.
		WPSEO_Redirect_File_Util::create_upload_dir();
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

		// Setup autoloader.
		require_once( dirname( __FILE__ ) . '/classes/class-premium-autoloader.php' );
		$autoloader = new WPSEO_Premium_Autoloader();
		spl_autoload_register( array( $autoloader, 'load' ) );

		$this->load_textdomain();

		$this->redirects = new WPSEO_Redirect();

		if ( is_admin() ) {

			// Disable Yoast SEO.
			add_action( 'admin_init', array( $this, 'disable_wordpress_seo' ), 1 );

			// Add Sub Menu page and add redirect page to admin page array.
			// This should be possible in one method in the future, see #535.
			add_filter( 'wpseo_submenu_pages', array( $this, 'add_submenu_pages' ) );

			// Add Redirect page as admin page.
			add_filter( 'wpseo_admin_pages', array( $this, 'add_admin_pages' ) );

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

			// Filter the Page Analysis content.
			add_filter( 'wpseo_pre_analysis_post_content', array( $this, 'filter_page_analysis' ), 10, 2 );

			// Settings.
			add_action( 'admin_init', array( $this, 'register_settings' ) );

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
	 * Hooks into the `redirect_canonical` filter to catch ongoing redirects and move them to the correct spot
	 *
	 * @param string $redirect_url
	 * @param string $requested_url
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
	 * @param string $hook
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
		wp_enqueue_script( 'wpseo-premium-admin-overview', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wpseo-premium-admin-overview' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
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
	 * @param array $patterns
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
	 * Filter for adding custom fields to page analysis
	 *
	 * Based on the configured custom fields for page analysis. this filter will get the needed values from post_meta
	 * and add them to the $page_content. Page analysis will be able to scan the content of these customs fields by
	 * doing this. - If value doesn't exists as a post-meta value, there will be nothing included.
	 *
	 * @param string $page_content The content of the current post text.
	 * @param object $post         The total object of the post content.
	 *
	 * @return string $page_content
	 */
	public function filter_page_analysis( $page_content, $post ) {

		$options       = get_option( WPSEO_Options::get_option_instance( 'wpseo_titles' )->option_name, array() );
		$target_option = 'page-analyse-extra-' . $post->post_type;

		if ( array_key_exists( $target_option, $options ) ) {
			$custom_fields = explode( ',', $options[ $target_option ] );

			if ( is_array( $custom_fields ) ) {
				foreach ( $custom_fields as $custom_field ) {
					$custom_field_data = get_post_meta( $post->ID, $custom_field, true );

					if ( ! empty( $custom_field_data ) ) {
						$page_content .= ' ' . $custom_field_data;
					}
				}
			}
		}

		return $page_content;
	}

	/**
	 * This hook will add an input-field for specifying custom fields for page analysis.
	 *
	 * The values will be comma-seperated and will target the belonging field in the post_meta. Page analysis will
	 * use the content of it by sticking it to the post_content.
	 *
	 * @param array  $wpseo_admin_pages
	 * @param string $name
	 */
	public function admin_page_meta_post_types_checkboxes( $wpseo_admin_pages, $name ) {
		echo Yoast_Form::get_instance()->textinput( 'page-analyse-extra-' . $name, __( 'Add custom fields to page analysis', 'wordpress-seo-premium' ) );
	}

	/**
	 * Function adds the premium pages to the Yoast SEO menu
	 *
	 * @param array $submenu_pages
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
	 * @param array $admin_pages
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
}
