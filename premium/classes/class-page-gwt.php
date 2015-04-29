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
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * Function that outputs the redirect page
	 */
	public function display() {
		require_once WPSEO_PREMIUM_PATH . 'views/gwt-display.php';
	}

	/**
	 * Function that is triggered when the redirect page loads
	 */
	public function page_load() {
		// Create a new WPSEO GWT Google Client
		$this->service = new WPSEO_GWT_Service();

		// Catch the authorization code POST
		$this->catch_authentication_post();

		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );

		// Check for error message
		if ( filter_input( INPUT_GET, 'error' ) === '1' ) {
			add_action( 'admin_notices', array( $this, 'admin_message_body' ) );
		}

	}

	/**
	 * Display the table
	 */
	public function display_table() {
		// The list table
		$list_table = new WPSEO_Crawl_Issue_Table();
		$list_table->prepare_items( );
		$list_table->search_box( __( 'Search', 'wordpress-seo-premium' ), 'wpseo-crawl-issues-search' );
		$list_table->display();
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
			'default' => 100,
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

			$active = ' nav-tab-active';
		}

		echo '<a class="nav-tab ' . $active . '" id="' . $platform_target . '-tab" href="' . $admin_link . $platform_target . '">' . $platform_value . '</a>';
	}


}
