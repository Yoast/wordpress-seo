<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Page
 */
class WPSEO_Redirect_Page {

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
		$redirect_presenter = new WPSEO_Redirect_Presenter( $this->get_current_tab(), $this->get_redirect_manager() );
		$redirect_presenter->display();
	}

	/**
	 * Catch the redirects search post and redirect it to a search get
	 */
	public function list_table_search() {
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
	public function enqueue_assets() {
		wp_enqueue_script( 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), '1.0.0-RC3', true );
		wp_enqueue_script( 'wpseo-premium-yoast-overlay', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wpseo-premium-yoast-overlay' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		 wp_enqueue_script( 'wp-seo-premium-admin-redirects', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wp-seo-premium-admin-redirects' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery', 'jquery-ui-dialog' ), WPSEO_VERSION );
		wp_localize_script( 'wp-seo-premium-admin-redirects', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );

		wp_enqueue_script( 'jquery-ui-dialog' );
		wp_enqueue_style( 'wp-jquery-ui-dialog' );

		add_screen_option( 'per_page', array(
			'label'   => __( 'Redirects per page', 'wordpress-seo-premium' ),
			'default' => 25,
			'option'  => 'redirects_per_page',
		) );
	}

	/**
	 * Catch redirects_per_page
	 *
	 * @param string $status Unused.
	 * @param string $option The option name where the value is set for.
	 * @param string $value  The new value for the screen option.
	 *
	 * @return string|void
	 */
	public function set_screen_option( $status, $option, $value ) {
		if ( 'redirects_per_page' === $option ) {
			return $value;
		}
	}

	/**
	 * Get the Yoast SEO options
	 *
	 * @return array
	 */
	public static function get_options() {
		static $options;

		if ( $options === null ) {
			$options = apply_filters(
				'wpseo_premium_redirect_options',
				wp_parse_args(
					get_option( 'wpseo_redirect', array() ),
					array(
						'disable_php_redirect' => 'off',
						'separate_file'        => 'off',
					)
				)
			);
		}

		return $options;
	}

	/**
	 * Initialize admin hooks.
	 */
	private function initialize_admin() {

		// Maybe the autoload for the option have to be changed.
		$this->change_option_autoload();

		// Setting the handling of the redirect option.
		new WPSEO_Redirect_Settings_Hooks( $this->get_redirect_manager() );

		// Convert post into get on search and loading the page scripts.
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_redirects' ) {
			add_action( 'admin_init', array( $this, 'list_table_search' ) );

			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
			add_filter( 'set-screen-option', array( $this, 'set_screen_option' ), 11, 3 );
		}
	}

	/**
	 * Initialize the AJAX redirect files
	 */
	private function initialize_ajax() {
		// Normal Redirect AJAX.
		new WPSEO_Redirect_Ajax( new WPSEO_Redirect_URL_Manager() );

		// Regex Redirect AJAX.
		new WPSEO_Redirect_Ajax( new WPSEO_Redirect_Regex_Manager() );
	}

	/**
	 * Getting the current active tab
	 *
	 * @return string
	 */
	private function get_current_tab() {
		static $current_tab;

		if ( $current_tab === null ) {
			$current_tab = filter_input( INPUT_GET, 'tab', FILTER_DEFAULT, array( 'options' => array( 'default' => 'plain' ) ) );
		}

		return $current_tab;
	}

	/**
	 * Setting redirect manager, based on the current active tab
	 *
	 * @return WPSEO_Redirect_Manager
	 */
	private function get_redirect_manager() {
		static $redirect_manager;

		if ( $redirect_manager === null ) {
			if ( $this->get_current_tab() === 'regex' ) {
				$redirect_manager = new WPSEO_Redirect_Regex_Manager();
			}
			else {
				$redirect_manager = new WPSEO_Redirect_URL_Manager();
			}
		}

		return $redirect_manager;
	}

	/**
	 * Check if the autoload for the redirect option have to be reloaded
	 *
	 * @return bool
	 */
	private function change_option_autoload() {
		// Check if WPSEO_DISABLE_PHP_REDIRECTS is defined.
		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && true === WPSEO_DISABLE_PHP_REDIRECTS ) {
			$this->get_redirect_manager()->change_option_autoload( false );
			$this->get_redirect_manager()->change_option_autoload( false );

			return true;
		}

		$options = self::get_options();

		// If the disable_php_redirect option is not enabled we should enable auto loading redirects.
		if ( 'off' === $options['disable_php_redirect'] ) {
			$this->get_redirect_manager()->change_option_autoload( true );
		}

		return true;
	}

}
