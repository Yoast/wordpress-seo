<?php
/**
 * @package WPSEO\admin|google_search_console
 */

/**
 * Class WPSEO_Page_GWT
 */
class WPSEO_Page_GWT {

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $settings;

	/**
	 * Constructor for the page class. This will initialize all GSC related stuff
	 */
	public function __construct() {
		// Settings
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// Post to Get on search
		add_action( 'admin_init', array( $this, 'list_table_search_post_to_get' ) );

		// Setting the screen option
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_webmaster_tools' ) {
			add_filter( 'set-screen-option', array( $this, 'set_screen_option' ), 11, 3 );
		}
	}

	/**
	 * Be sure the settings will be registered, so data can be stored
	 *
	 */
	public function register_settings() {
		register_setting( 'yoast_wpseo_gwt_options', 'wpseo-gwt' );
	}

	/**
	 * Function that outputs the redirect page
	 */
	public function display() {
		require_once 'views/gwt-display.php';
	}

	/**
	 * Function that is triggered when the redirect page loads
	 */
	public function page_load() {
		// Create a new WPSEO GWT Google Client
		$this->service  = new WPSEO_GWT_Service();

		$this->settings = new WPSEO_GWT_Settings( $this->service );

		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );

		// Catch bulk action request
		new WPSEO_Crawl_Issue_Bulk();
	}

	/**
	 * Display the table
	 *
	 * @param WPSEO_GWT_Platform_Tabs $platform_tabs
	 */
	public function display_table( WPSEO_GWT_Platform_Tabs $platform_tabs ) {
		// The list table
		$list_table = new WPSEO_Crawl_Issue_Table( $platform_tabs, $this->service );
		$list_table->prepare_items( );
		$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-crawl-issues-search' );
		$list_table->display();
	}

	/**
	 * Load the admin redirects scripts
	 */
	public function page_scripts() {
		wp_enqueue_script( 'wp-seo-admin-gsc', plugin_dir_url( WPSEO_FILE ) . 'js/wp-seo-admin-gsc' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		add_screen_option( 'per_page', array(
			'label'   => __( 'Crawl errors per page', 'wordpress-seo' ),
			'default' => 50,
			'option'  => 'errors_per_page',
		) );

		wp_enqueue_style( 'jquery-qtip.js', plugins_url( 'css/jquery.qtip' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_enqueue_style( 'metabox-tabs', plugins_url( 'css/metabox-tabs' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_enqueue_script( 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
	}

	/**
	 * Set the screen options
	 *
	 * @param string $status
	 * @param string $option
	 * @param string $value
	 *
	 * @return mixed
	 */
	public function set_screen_option( $status, $option, $value ) {
		if ( 'errors_per_page' == $option ) {
			return $value;
		}
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	public function list_table_search_post_to_get() {

		if ( $search_string = filter_input( INPUT_POST, 's' ) ) {

			// Check if the POST is on one of our pages
			if ( filter_input( INPUT_GET, 'page' ) !== 'wpseo_webmaster_tools' ) {
				return;
			}

			$url = add_query_arg( 's', $search_string );

			// Do the redirect
			wp_redirect( $url );
			exit;
		}
	}

}
