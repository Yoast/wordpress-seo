<?php
/**
 * @package Premium\Redirect
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


class WPSEO_Page_GWT {

	/**
	 * Catch the authentication post
	 */
	private function catch_authentication_post() {
		// Catch the authorization code POST
		if ( isset ( $_POST['gwt']['authorization_code'] ) && trim( $_POST['gwt']['authorization_code'] ) != '' ) {

			$redirect_url_appendix = '';

			// Authenticate user
			$gwt_authentication = new WPSEO_GWT_Authentication();
			if ( ! $gwt_authentication->authenticate( $_POST['gwt']['authorization_code'] ) ) {
				$redirect_url_appendix = '&error=1';
			}

			// Redirect user to prevent a post resubmission which causes an oauth error
			wp_redirect( admin_url( 'admin.php' ) . '?page=' . $_GET['page'] . $redirect_url_appendix );
			exit;
		}
	}

	/**
	 * Function that outputs the redirect page
	 */
	public function display() {
		global $wpseo_admin_pages;

		// Admin header
		$wpseo_admin_pages->admin_header( false, 'yoast_wpseo_redirects_options', 'wpseo_redirects' );

		// Create a new WPSEO GWT Google Client
		$gwt_client = new WPSEO_GWT_Google_Client();

		// Check if there is an access token
		if ( null != $gwt_client->getAccessToken() ) {

			//echo "<h2>Google Webmaster Tools Errors</h2>\n";

			// Open <form>
			echo "<form id='wpseo-crawl-issues-table-form' action='" . admin_url( 'admin.php' ) . '?page=' . $_GET['page'] . "' method='post'>\n";

			// AJAX nonce
			echo "<input type='hidden' class='wpseo_redirects_ajax_nonce' value='" . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . "' />\n";

			// The list table
			$list_table = new WPSEO_Crawl_Issue_Table( $gwt_client );
			$list_table->prepare_items();
			$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-crawl-issues-search' );
			$list_table->display();

			// Close <form>
			echo "</form>\n";

		} else {

			// Get the oauth URL
			$oath_url = $gwt_client->createAuthUrl();

			// Print auth screen
			echo "<p>" . __( 'To allow WordPress SEO Premium to fetch your Google Webmaster Tools information, please enter your Google Authorization Code.', 'wordpress-seo' ) . "</p>\n";
			echo "<a href='javascript:wpseo_gwt_open_authorize_code_window(\"{$oath_url}\");'>" . __( 'Click here to get a Google Authorization Code', 'wordpress-seo' ) . "</a>\n";

			echo "<p>" . __( 'Please enter the Authorization Code in the field below and press the Auhtenticate button.', 'wordpress-seo' ) . "</p>\n";
			echo "<form action='' method='post'>\n";
			echo "<input type='text' name='gwt[authorization_code]' value='' />";
			echo "<input type='submit' name='gwt[Submit]' value='" . __( 'Authenticate', 'wordpress-seo' ) . "' class='button-primary' />";
			echo "</form>\n";
		}

		?>

		<br class="clear">
		<?php

		// Admin footer
		$wpseo_admin_pages->admin_footer( false );
	}

	/**
	 * Function that is triggered when the redirect page loads
	 */
	public function page_load() {

		// Catch the authorization code POST
		$this->catch_authentication_post();

		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );

		// Check for error message
		if ( isset( $_GET['error'] ) && $_GET['error'] == '1' ) {
			add_action( 'admin_notices', array( $this, 'admin_message_body' ) );
		}

		// Add views
		add_filter( 'views_seo_page_wpseo_webmaster_tools', array( $this, 'add_page_views' ) );

	}

	/**
	 * Add page views
	 *
	 * @param array $views
	 *
	 * @return array
	 */
	public function add_page_views( $views ) {

		// Base URL
		$base_url = admin_url( 'admin.php' ) . "?page=" . $_GET['page'];

		$current = ( isset ( $_GET['status'] ) ? $_GET['status'] : '' );

		$views_arr = array(
				'all'               => 'All',
				'not-redirected' => 'Not redirected'
		);

		// Add views
		/*
		$new_views = array(
				'all'            => "<a href='" . $base_url . "' class='current'>All</a>",
				'not-redirected' => "<a href='" . $base_url . "&status=not-redirected'>Not redirected</a>",
			//'ignored' => "<a href='" . $base_url . "'>Ignored</a>",
		);
		*/

		$new_views = array();

		foreach ( $views_arr as $key => $val ) {
			$new_views[$key] = "<a href='" . $base_url . "&status={$key}'" . ( ( $current == $key ) ? " class='current'" : "" ) . ">{$val}</a>";
		}


		return $new_views;
	}

	/**
	 * Print Incorrect Google Authorization Code error
	 */
	public function admin_message_body() {
		?>
		<div class="error">
			<p><b><?php _e( 'Incorrect Google Authorization Code!', 'wordpress-seo' ); ?></b></p>
		</div>
	<?php
	}

	/**
	 * Load the admin redirects scripts
	 */
	public function page_scripts() {
		wp_enqueue_script( 'wp-seo-premium-admin-gwt', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-admin-gwt.js', array( 'jquery' ), '1.0.0' );
		wp_localize_script( 'wp-seo-premium-admin-gwt', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );
		add_screen_option( 'per_page', array( 'label' => 'Crawl errors per page', 'default' => 25, 'option' => 'errors_per_page' ) );
	}

	/**
	 * Set the screen options
	 *
	 * @param $status
	 * @param $option
	 * @param $value
	 *
	 * @return mixed
	 */
	public function set_screen_option( $status, $option, $value ) {
		if ( 'errors_per_page' == $option ) {
			return $value;
		}
	}

}