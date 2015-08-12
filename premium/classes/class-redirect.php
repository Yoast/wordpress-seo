<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect
 */
class WPSEO_Redirect {

	/**
	 * @var WPSEO_Redirect_Manager
	 */
	private $redirect_manager;

	/**
	 * Constructing redirect module
	 */
	public function __construct() {

		if ( is_admin() ) {
			$this->initialize_admin();
		}

		// Only initialize the ajax for all tabs except settings.
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			$this->initialize_ajax();
		}
	}

	/**
	 * Display the presenter
	 */
	public function display() {
		$display_params = array();
		if ( in_array( $this->get_current_tab(), array( 'url', 'regex' ) ) ) {
			$display_params = array(
				'redirect_table' => new WPSEO_Redirect_Table( $this->get_current_tab(), $this->redirect_manager ),
			);
		}

		$redirect_presenter = new WPSEO_Redirect_Presenter( $this->get_current_tab(), $display_params );
		$redirect_presenter->display();
	}

	/**
	 * Hook that runs after the 'wpseo_redirect' option is updated
	 *
	 * @param array $old_value
	 * @param array $value
	 */
	public function save_redirect_files( $old_value, $value ) {
		// Check if we need to remove the WPSEO redirect entries from the .htacccess file.
		$remove_htaccess_entries = false;

		// Check if the 'disable_php_redirect' option set to true/on.
		if ( ! empty( $value['disable_php_redirect'] ) && 'on' === $value['disable_php_redirect'] ) {

			// Remove .htaccess entries if the 'separate_file' option is set to true.
			if ( WPSEO_Utils::is_apache() && ! empty( $value['separate_file'] ) && 'on' === $value['separate_file'] ) {
				$remove_htaccess_entries = true;
			}

			// The 'disable_php_redirect' option is set to true(on) so we need to generate a file.
			// The Redirect Manager will figure out what file needs to be created.
			$this->redirect_manager->save_redirect_file();
		}
		else if ( WPSEO_Utils::is_apache() ) {
			// No settings are set so we should also strip the .htaccess redirect entries in this case.
			$remove_htaccess_entries = true;
		}

		// Check if we need to remove the .htaccess redirect entries.
		if ( $remove_htaccess_entries ) {
			// Remove the .htaccess redirect entries.
			WPSEO_Redirect_Htaccess::clear_htaccess_entries();
		}
	}

	/**
	 * Do custom action when the redirect option is saved
	 */
	public function catch_option_redirect_save() {
		if ( current_user_can( 'manage_options' ) && filter_input( INPUT_POST, 'option_page' ) === 'yoast_wpseo_redirect_options' ) {
			$wpseo_redirect  = filter_input( INPUT_POST, 'wpseo_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
			$enable_autoload = empty( $wpseo_redirect['disable_php_redirect'] );

			$this->redirect_manager->change_autoload( $enable_autoload );
		}
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	public function list_table_search_post_to_get() {
		if ( ( $search_string = filter_input( INPUT_POST, 's' ) ) !== null ) {
			$url = ( $search_string !== '' ) ? add_query_arg( 's', $search_string ) : remove_query_arg( 's' );

			// Do the redirect.
			wp_redirect( $url );

			exit;
		}
	}

	/**
	 * Load the admin redirects scripts
	 */
	public function page_scripts() {
		wp_enqueue_script( 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), '1.0.0-RC3', true );
		wp_enqueue_script( 'wpseo-premium-yoast-overlay', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wpseo-premium-yoast-overlay' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		wp_enqueue_script( 'wp-seo-premium-admin-redirects', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wp-seo-premium-admin-redirects' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		wp_localize_script( 'wp-seo-premium-admin-redirects', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );

		add_screen_option( 'per_page', array(
			'label'   => __( 'Redirects per page', 'wordpress-seo-premium' ),
			'default' => 25,
			'option'  => 'redirects_per_page',
		) );
	}

	/**
	 * Catch redirects_per_page
	 *
	 * @param string $status
	 * @param string $option
	 * @param string $value
	 *
	 * @return string|void
	 */
	public function set_screen_option( $status, $option, $value ) {
		if ( 'redirects_per_page' === $option ) {
			return $value;
		}
	}

	/**
	 * Initialize admin hooks.
	 */
	private function initialize_admin() {
		// Setting the redirect manager.
		$this->set_redirect_manager();

		// Check if WPSEO_DISABLE_PHP_REDIRECTS is defined.
		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {
			$this->redirect_manager->change_autoload( false );
		}
		else {
			$options = WPSEO_Redirect_Manager::get_options();

			// If the disable_php_redirect option is not enabled we should enable auto loading redirects.
			if ( 'off' === $options['disable_php_redirect'] ) {
				$this->redirect_manager->change_autoload( true );
			}
		}

		// Post to Get on search.
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_redirects' ) {
			add_action( 'admin_init', array( $this, 'list_table_search_post_to_get' ) );
		}

		// Check if we need to save files after updating options.
		add_action( 'update_option_wpseo_redirect', array( $this, 'save_redirect_files' ), 10, 2 );

		// Catch option save.
		add_action( 'admin_init', array( $this, 'catch_option_redirect_save' ) );

		// Loading the page scripts.
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_redirects' ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );
			add_filter( 'set-screen-option', array( $this, 'set_screen_option' ), 11, 3 );
		}

	}

	/**
	 * Initialize the AJAX redirect files
	 */
	private function initialize_ajax() {
		// Normal Redirect AJAX.
		new WPSEO_Redirect_Ajax( new WPSEO_URL_Redirect_Manager(), 'url' );

		// Regex Redirect AJAX.
		new WPSEO_Redirect_Ajax( new WPSEO_REGEX_Redirect_Manager(), 'regex' );

		// Add URL reponse code check AJAX.
		add_action( 'wp_ajax_wpseo_check_url', array( 'WPSEO_Url_Checker', 'check_url' ) );
	}

	/**
	 * Getting the current active tab
	 *
	 * @return string
	 */
	private function get_current_tab() {
		static $current_tab;

		if ( $current_tab === null ) {
			$current_tab = filter_input( INPUT_GET, 'tab', FILTER_DEFAULT, array( 'options' => array( 'default' => 'url' ) ) );
		}

		return $current_tab;
	}

	/**
	 * Setting redirect manager, based on the current active tab
	 */
	private function set_redirect_manager() {
		switch ( $this->get_current_tab() ) {
			case 'regex' :
				$this->redirect_manager = new WPSEO_REGEX_Redirect_Manager();
				break;

			default :
				$this->redirect_manager = new WPSEO_URL_Redirect_Manager();
				break;
		}
	}

}
