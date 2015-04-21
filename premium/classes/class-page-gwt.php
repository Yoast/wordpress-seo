<?php

/**
 * @package Premium\Redirect
 * @subpackage premium
 */

/**
 * Class WPSEO_Page_GWT
 */
class WPSEO_Page_GWT {

	/**
	 * @var string
	 */
	private $current_tab;


	/**
	 * Function that outputs the redirect page
	 */
	public function display() {
		// Create a new WPSEO GWT Google Client
		$gwt_client = $this->setup_client();

		require_once WPSEO_PREMIUM_PATH . 'views/gwt-display.php';
	}

	/**
	 * Function that is triggered when the redirect page loads
	 */
	public function page_load() {

		// Catch the reload crawl issues POST
		$this->catch_reload_crawl_issues();

		// Catch the authorization code POST
		$this->catch_authentication_post();

		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );

		// Check for error message
		if ( filter_input( INPUT_GET, 'error' ) === '1' ) {
			add_action( 'admin_notices', array( $this, 'admin_message_body' ) );
		}

	}

	/**
	 * Print Incorrect Google Authorization Code error
	 */
	public function admin_message_body() {
		?>
		<div class="error">
			<p><b><?php _e( 'Incorrect Google Authorization Code!', 'wordpress-seo-premium' ); ?></b></p>
		</div>
		<?php
	}

	/**
	 * Load the admin redirects scripts
	 */
	public function page_scripts() {
		wp_enqueue_script( 'wpseo-premium-yoast-overlay', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wpseo-premium-yoast-overlay' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), '1.0.0' );
		wp_enqueue_script( 'wp-seo-premium-admin-gwt', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-admin-gwt' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), '1.0.0' );
		wp_localize_script( 'wp-seo-premium-admin-gwt', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );
		add_screen_option( 'per_page', array(
			'label'   => __( 'Crawl errors per page', 'wordpress-seo-premium' ),
			'default' => 25,
			'option'  => 'errors_per_page',
		) );
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
	 * Catch the reload-crawl-issues POST
	 */
	private function catch_reload_crawl_issues() {
		if ( isset( $_POST['reload-crawl-issues'] ) ) {
			$crawl_issue_manager = new WPSEO_Crawl_Issue_Manager();
			$crawl_issue_manager->remove_last_checked();
		}
	}
	/**
	 * Catch the authentication post
	 */
	private function catch_authentication_post() {
		$redirect_url_appendix = '';

		// Catch the authorization code POST
		if ( isset ( $_POST['gwt']['authorization_code'] ) && wp_verify_nonce( $_POST['gwt']['gwt_nonce'], 'wpseo-gwt_nonce' ) ) {
			if ( trim( $_POST['gwt']['authorization_code'] ) != '' ) {
				if ( ! $this->setup_client()->authenticate_client( $_POST['gwt']['authorization_code'] ) ) {
					$redirect_url_appendix = '&error=1';
				}
			}
			else {
				$redirect_url_appendix = '&error=1';
			}

			// Redirect user to prevent a post resubmission which causes an oauth error
			wp_redirect( admin_url( 'admin.php' ) . '?page=' . esc_attr( filter_input( INPUT_GET, 'page' ) ) . $redirect_url_appendix );
			exit;
		}
	}

	/**
	 *
	 */
	private function platform_tabs() {
		$platforms = array(
			'web'    		  => __( 'Web', 'wordpress-seo' ),
			'mobile' 	      => __( 'Mobile devices', 'wordpress-seo' ),
			'smartphone_only' => __( 'Only smartphone', 'wordpress-seo' ),
			'settings'        => __( 'Settings', 'wordpress-seo' ),
		);

		$admin_link = admin_url( 'admin.php?page=wpseo_webmaster_tools&tab=' );

		$this->set_current_tab( $platforms );

		foreach ( $platforms as $platform_target => $platform_value ) {
			$this->platform_tab( $platform_target, $platform_value, $admin_link );
		}
	}

	/**
	 * Setting the current tab
	 *
	 * @param array $platforms
	 */
	private function set_current_tab( array $platforms ) {
		$this->current_tab = key( $platforms );
		if ( $current_platform = filter_input( INPUT_GET, 'tab' ) ) {
			$this->current_tab = $current_platform;
		}
	}

	/**
	 * Parses the tab
	 *
	 * @param string $platform_target
	 * @param string $platform_value
	 * @param string $admin_link
	 */
	private function platform_tab( $platform_target, $platform_value, $admin_link ) {
		$active = '';
		if ( $this->current_tab === $platform_target ) {
			$active = ' nav-tab-active';
		}

		echo '<a class="nav-tab ' . $active . '" id="' . $platform_target . '-tab" href="' . $admin_link . $platform_target . '">' . $platform_value . '</a>';
	}

	/**
	 * Setting up the client
	 *
	 * @return WPSEO_GWT_Client
	 */
	private function setup_client() {
		Yoast_Api_Libs::load_api_libraries( array( 'google' ) );


		require WPSEO_PREMIUM_PATH . 'config/gwt.php';

		return new WPSEO_GWT_Client( $config );
	}

}

class WPSEO_GWT_Mapper {

	private static $platforms = array(
		'web'             => 'web',
		'mobile'          => 'mobile',
		'smartphone_only' => 'smartphoneOnly',
	);

	private static $categories = array(
		'auth_permissions'     => 'authPermissions',
		'many_to_one_redirect' => 'manyToOneRedirect',
		'not_followed'         => 'notFollowed',
		'not_found'            => 'notFound',
		'other'                => 'other',
		'roboted'              => 'roboted',
		'server_error'         => 'serverError',
		'soft_404'             => 'soft404',
	);

	/**
	 * @param string $platform
	 *
	 * @return mixed
	 */
	public static function platform( $platform ) {
		if ( array_key_exists( $platform, self::$platforms ) ) {
			return self::$platforms[ $platform ];
		}
	}

	/**
	 * @param string $category
	 *
	 * @return mixed
	 */
	public static function category( $category ) {
		if ( array_key_exists( $category, self::$categories ) ) {
			return self::$categories[ $category ];
		}
	}


}