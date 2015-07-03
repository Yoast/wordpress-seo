<?php
/**
 * @package WPSEO\admin|google_search_console
 */

/**
 * Class WPSEO_GSC
 */
class WPSEO_GSC {

	/**
	 * The option where data will be stored
	 */
	const OPTION_WPSEO_GSC = 'wpseo-gwt';

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * Constructor for the page class. This will initialize all GSC related stuff
	 */
	public function __construct() {
		// Settings.
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// Setting the screen option.
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_webmaster_tools' ) {
			add_filter( 'set-screen-option', array( $this, 'set_screen_option' ), 11, 3 );
		}
	}

	/**
	 * Be sure the settings will be registered, so data can be stored
	 */
	public function register_settings() {
		register_setting( 'yoast_wpseo_gwt_options', self::OPTION_WPSEO_GSC );
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
		// Create a new WPSEO GWT Google Client.
		$this->service = new WPSEO_GWT_Service( WPSEO_GWT_Settings::get_profile() );

		$this->request_handler();

		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );
	}

	/**
	 * Display the table
	 *
	 * @param WPSEO_GWT_Platform_Tabs $platform_tabs
	 */
	public function display_table( WPSEO_GWT_Platform_Tabs $platform_tabs ) {
		// The list table.
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
	 * Handles the POST and GET requests
	 */
	private function request_handler() {

		// List the table search post to a get.
		$this->list_table_search_post_to_get();

		// Catch the authorization code POST.
		$this->catch_authentication_post();

		// Is there a reset post than we will remove the posts and data.
		if ( filter_input( INPUT_POST, 'gwt_reset' ) ) {
			WPSEO_GWT_Settings::clear_data( $this->service );
		}

		// Reloads al the issues.
		if ( wp_verify_nonce( filter_input( INPUT_POST, 'reload-crawl-issues-nonce' ), 'reload-crawl-issues' ) && filter_input( INPUT_POST, 'reload-crawl-issues' ) ) {
			WPSEO_GWT_Settings::reload_issues();
		}

		// Catch bulk action request.
		new WPSEO_Crawl_Issue_Bulk();
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	private function list_table_search_post_to_get() {
		if ( $search_string = filter_input( INPUT_POST, 's' ) ) {
			$url = add_query_arg( 's', $search_string );

			// Do the redirect.
			wp_redirect( $url );
			exit;
		}
	}

	/**
	 * Catch the authentication post
	 */
	private function catch_authentication_post() {
		$gwt_values = filter_input( INPUT_POST, 'gwt', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		// Catch the authorization code POST.
		if ( ! empty( $gwt_values['authorization_code'] ) && wp_verify_nonce( $gwt_values['gwt_nonce'], 'wpseo-gwt_nonce' ) ) {
			if ( ! WPSEO_GWT_Settings::validate_authorization( trim( $gwt_values['authorization_code'] ), $this->service->get_client() ) ) {
				Yoast_Notification_Center::get()->add_notification(
					new Yoast_Notification(
						__( 'Incorrect Google Authorization Code!', 'wordpress-seo' ),
						array(
							'type'  => 'error',
						)
					)
				);
			}

			// Redirect user to prevent a post resubmission which causes an oauth error.
			wp_redirect( admin_url( 'admin.php' ) . '?page=' . esc_attr( filter_input( INPUT_GET, 'page' ) ) . '&tab=settings' );
			exit;
		}
	}

}
