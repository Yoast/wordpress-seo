<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Page.
 */
class WPSEO_Redirect_Page {

	/**
	 * Constructing redirect module.
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
	 * Display the presenter.
	 */
	public function display() {
		$redirect_presenter = new WPSEO_Redirect_Presenter();
		$redirect_presenter->display( $this->get_current_tab() );
	}

	/**
	 * Catches possible posted filter values and redirects it to a GET-request.
	 *
	 * It catches:
	 * A search post.
	 * A redirect-type filter.
	 */
	public function list_table_search() {
		$options = array( 'options' => array( 'default' => '' ) );
		$url     = filter_input( INPUT_SERVER, 'REQUEST_URI', FILTER_SANITIZE_URL, $options );

		if ( empty( $url ) && isset( $_SERVER['REQUEST_URI'] ) ) {
			$url = filter_var( $_SERVER['REQUEST_URI'], FILTER_SANITIZE_URL, $options );
		}

		$new_url = $this->extract_redirect_type_from_url( $url );
		$new_url = $this->extract_search_string_from_url( $new_url );

		if ( $url !== $new_url ) {
			// Do the redirect.
			wp_safe_redirect( $new_url );
			exit;
		}
	}

	/**
	 * Extracts the redirect type from the passed URL.
	 *
	 * @param string $url The URL to try and extract the redirect type from.
	 *
	 * @return string The newly formatted URL. Returns original URL if filter is null.
	 */
	protected function extract_redirect_type_from_url( $url ) {
		$filter = filter_input( INPUT_POST, 'redirect-type' );

		if ( $filter === null ) {
			return $url;
		}

		$new_url = remove_query_arg( 'redirect-type', $url );

		if ( $filter !== '0' ) {
			$new_url = add_query_arg( 'redirect-type', rawurlencode( $filter ), $new_url );
		}

		return $new_url;
	}

	/**
	 * Extracts the search string from the passed URL.
	 *
	 * @param string $url The URL to try and extract the search string from.
	 *
	 * @return string The newly formatted URL. Returns original URL if search string is null.
	 */
	protected function extract_search_string_from_url( $url ) {
		$search_string = filter_input( INPUT_POST, 's' );

		if ( $search_string === null ) {
			return $url;
		}

		$new_url = remove_query_arg( 's', $url );

		if ( $search_string !== '' ) {
			$new_url = add_query_arg( 's', rawurlencode( $search_string ), $new_url );
		}

		return $new_url;
	}

	/**
	 * Load the admin redirects scripts
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$version       = $asset_manager->flatten_version( WPSEO_VERSION );

		wp_enqueue_script(
			'wp-seo-premium-admin-redirects',
			plugin_dir_url( WPSEO_PREMIUM_FILE ) .
			'assets/js/dist/wp-seo-premium-admin-redirects-' . $version . WPSEO_CSSJS_SUFFIX . '.js',
			array( 'jquery', 'jquery-ui-dialog', 'wp-util', 'underscore' ),
			WPSEO_VERSION
		);
		wp_localize_script( 'wp-seo-premium-admin-redirects', 'wpseoPremiumStrings', WPSEO_Premium_Javascript_Strings::strings() );
		wp_localize_script( 'wp-seo-premium-admin-redirects', 'wpseoSelect2Locale', substr( WPSEO_Utils::get_user_locale(), 0, 2 ) );

		wp_enqueue_style( 'wpseo-premium-redirects', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/css/dist/premium-redirects-' . $version . WPSEO_CSSJS_SUFFIX . '.css', array(), WPSEO_VERSION );

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
	 * Hook that runs after the 'wpseo_redirect' option is updated
	 *
	 * @param array $old_value Unused.
	 * @param array $value     The new saved values.
	 */
	public function save_redirect_files( $old_value, $value ) {

		$is_php = ( empty( $value['disable_php_redirect'] ) || 'on' !== $value['disable_php_redirect'] );

		$was_separate_file = ( ! empty( $old_value['separate_file'] ) && 'on' === $old_value['separate_file'] );
		$is_separate_file  = ( ! empty( $value['separate_file'] ) && 'on' === $value['separate_file'] );

		// Check if the 'disable_php_redirect' option set to true/on.
		if ( ! $is_php ) {
			// The 'disable_php_redirect' option is set to true(on) so we need to generate a file.
			// The Redirect Manager will figure out what file needs to be created.
			$redirect_manager = new WPSEO_Redirect_Manager();
			$redirect_manager->export_redirects();
		}

		// Check if we need to remove the .htaccess redirect entries.
		if ( WPSEO_Utils::is_apache() ) {
			if ( $is_php || ( ! $was_separate_file && $is_separate_file ) ) {
				// Remove the apache redirect entries.
				WPSEO_Redirect_Htaccess_Util::clear_htaccess_entries();
			}

			if ( $is_php || ( $was_separate_file && ! $is_separate_file ) ) {
				// Remove the apache separate file redirect entries.
				WPSEO_Redirect_File_Util::write_file( WPSEO_Redirect_File_Util::get_file_path(), '' );
			}
		}

		if ( WPSEO_Utils::is_nginx() && $is_php ) {
			// Remove the nginx redirect entries.
			$this->clear_nginx_redirects();
		}

	}

	/**
	 * The server should always be apache. And the php redirects have to be enabled or in case of a separate
	 * file it should be disabled.
	 *
	 * @param boolean $disable_php_redirect Are the php redirects disabled.
	 * @param boolean $separate_file        Value of the separate file.
	 *
	 * @return bool
	 */
	private function remove_htaccess_entries( $disable_php_redirect, $separate_file ) {
		return ( WPSEO_Utils::is_apache() && ( ! $disable_php_redirect || ( $disable_php_redirect && $separate_file ) ) );
	}

	/**
	 * Clears the redirects from the nginx config.
	 */
	private function clear_nginx_redirects() {
		$redirect_file = WPSEO_Redirect_File_Util::get_file_path();
		if ( is_writable( $redirect_file ) ) {
			WPSEO_Redirect_File_Util::write_file( $redirect_file, '' );
		}
	}

	/**
	 * Initialize admin hooks.
	 */
	private function initialize_admin() {
		$this->fetch_bulk_action();

		// Check if we need to save files after updating options.
		add_action( 'update_option_wpseo_redirect', array( $this, 'save_redirect_files' ), 10, 2 );

		// Convert post into get on search and loading the page scripts.
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_redirects' ) {
			$upgrade_manager = new WPSEO_Upgrade_Manager();
			$upgrade_manager->retry_upgrade_31();

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
		new WPSEO_Redirect_Ajax( WPSEO_Redirect::FORMAT_PLAIN );

		// Regex Redirect AJAX.
		new WPSEO_Redirect_Ajax( WPSEO_Redirect::FORMAT_REGEX );
	}

	/**
	 * Getting the current active tab
	 *
	 * @return string
	 */
	private function get_current_tab() {
		static $current_tab;

		if ( $current_tab === null ) {
			$current_tab = filter_input(
				INPUT_GET,
				'tab',
				FILTER_VALIDATE_REGEXP,
				array(
					'options' => array(
						'default' => 'plain',
						'regexp'  => '/^(plain|regex|settings)$/',
					),
				)
			);
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
			$redirects_format = WPSEO_Redirect::FORMAT_PLAIN;
			if ( $this->get_current_tab() === WPSEO_Redirect::FORMAT_REGEX ) {
				$redirects_format = WPSEO_Redirect::FORMAT_REGEX;
			}

			$redirect_manager = new WPSEO_Redirect_Manager( $redirects_format );
		}

		return $redirect_manager;
	}

	/**
	 * Fetches the bulk action for removing redirects.
	 */
	private function fetch_bulk_action() {
		if ( wp_verify_nonce( filter_input( INPUT_POST, 'wpseo_redirects_ajax_nonce' ), 'wpseo-redirects-ajax-security' ) ) {
			if ( filter_input( INPUT_POST, 'action' ) === 'delete' || filter_input( INPUT_POST, 'action2' ) === 'delete' ) {
				$bulk_delete = filter_input( INPUT_POST, 'wpseo_redirects_bulk_delete', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
				$redirects   = array();
				foreach ( $bulk_delete as $origin ) {
					$redirect = $this->get_redirect_manager()->get_redirect( $origin );
					if ( $redirect !== false ) {
						$redirects[] = $redirect;
					}
				}

				$this->get_redirect_manager()->delete_redirects( $redirects );
			}
		}
	}
}
