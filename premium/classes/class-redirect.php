<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect
 */
class WPSEO_Redirect {

	/**
	 * @var WPSEO_URL_Redirect_Manager
	 */
	private $normal_redirect_manager;

	/**
	 * @var WPSEO_REGEX_Redirect_Manager
	 */
	private $regex_redirect_manager;

	/**
	 *
	 */
	public function __construct() {
		$this->normal_redirect_manager = new WPSEO_URL_Redirect_Manager();
		$this->regex_redirect_manager  = new WPSEO_REGEX_Redirect_Manager();

		if ( is_admin() ) {
			$this->initialize_admin();
		}

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			$this->initialize_ajax();
		}
	}

	/**
	 * Display the presenter
	 */
	public function display() {
		$redirect_presenter = new WPSEO_Redirect_Presenter();
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
			$this->normal_redirect_manager->save_redirect_file();

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

			$this->redirects_change_autoload( $enable_autoload );
		}
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	public function list_table_search_post_to_get() {
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_redirects' && ( $search_string = trim( filter_input( INPUT_POST, 's' ) ) ) ) {

			// Check if there isn't a bulk action post, bulk action post > search post.
			if ( filter_input( INPUT_POST, 'create_redirects' ) || filter_input( INPUT_POST, 'wpseo_redirects_bulk_delete' ) ) {
				return;
			}

			// Base URL.
			$url = get_admin_url() . 'admin.php?page=wpseo_redirects';

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
		// Check if WPSEO_DISABLE_PHP_REDIRECTS is defined.
		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {
			$this->redirects_change_autoload( false );
		}
		else {
			$options = WPSEO_Redirect_Manager::get_options();

			// If the disable_php_redirect option is not enabled we should enable auto loading redirects.
			if ( 'off' === $options['disable_php_redirect'] ) {
				$this->redirects_change_autoload( true );
			}
		}

		// Post to Get on search.
		add_action( 'admin_init', array( $this, 'list_table_search_post_to_get' ) );

		// Check if we need to save files after updating options.
		add_action( 'update_option_wpseo_redirect', array( $this, 'save_redirect_files' ), 10, 2 );

		// Catch option save.
		add_action( 'admin_init', array( $this, 'catch_option_redirect_save' ) );

		// Loading the page scripts
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
		$normal_redirect_manager_ajax = new WPSEO_Redirect_Ajax( $this->normal_redirect_manager, 'url' );

		// Regex Redirect AJAX.
		$regex_redirect_manager_ajax = new WPSEO_Redirect_Ajax( $this->regex_redirect_manager, 'regex' );

		// Add URL reponse code check AJAX.
		add_action( 'wp_ajax_wpseo_check_url', array( 'WPSEO_Url_Checker', 'check_url' ) );
	}

	/**
	 * Changing the autoload value for the redirect managers
	 *
	 * @param bool $autoload_value
	 */
	private function redirects_change_autoload( $autoload_value ) {
		// Change the normal redirect autoload option.
		$this->normal_redirect_manager->redirects_change_autoload( $autoload_value );

		// Change the regex redirect autoload option.
		$this->regex_redirect_manager->redirects_change_autoload( $autoload_value );
	}

}