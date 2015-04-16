<?php

/**
 * @package Premium\Redirect
 */
class WPSEO_Page_GWT {


	/**
	 */


	/**
	 * Function that outputs the redirect page
	 */
	public function display() {

		// Admin header
		Yoast_Form::get_instance()->admin_header( false, 'wpseo_redirects', false, 'yoast_wpseo_redirects_options' );
		?>
		<h2 class="nav-tab-wrapper" id="wpseo-tabs">
			<form action="" method="post">
				<input type="submit" name="reload-crawl-issues" id="reload-crawl-issue" class="button-primary"
				       style="float: right;" value="<?php _e( 'Reload crawl issues', 'wordpress-seo-premium' ); ?>">
			</form>
			<a class="nav-tab" id="crawl-issues-tab"
			   href="#top#redirects"><?php _e( 'Crawl Issues', 'wordpress-seo-premium' ); ?></a>
			<a class="nav-tab" id="settings-tab"
			   href="#top#settings"><?php _e( 'Settings', 'wordpress-seo-premium' ); ?></a>

		</h2>

		<div class="tabwrapper>">
			<div id="crawl-issues" class="wpseotab">
				<?php

				// Create a new WPSEO GWT Google Client
				$gwt_client = new WPSEO_GWT_Google_Client();

				// Check if there is an access token
				if ( null != $gwt_client->getAccessToken() ) {

					//echo "<h2>Google Webmaster Tools Errors</h2>\n";

					$status = '';
					if ( ! empty( $_GET['status'] ) ) {
						$status = "&status={$_GET['status']}";
					}

					// Open <form>
					echo "<form id='wpseo-crawl-issues-table-form' action='" . admin_url( 'admin.php' ) . '?page=' . esc_attr( $_GET['page'] ) . $status . "' method='post'>\n";

					// AJAX nonce
					echo "<input type='hidden' class='wpseo_redirects_ajax_nonce' value='" . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . "' />\n";

					// The list table
					$list_table = new WPSEO_Crawl_Issue_Table( $gwt_client );
					$list_table->prepare_items();
					$list_table->search_box( __( 'Search', 'wordpress-seo-premium' ), 'wpseo-crawl-issues-search' );
					$list_table->display();

					// Close <form>
					echo "</form>\n";

				}
				else {

					// Get the oauth URL
					$oath_url = $gwt_client->createAuthUrl();

					// Print auth screen
					echo "<p>" . __( 'To allow WordPress SEO Premium to fetch your Google Webmaster Tools information, please enter your Google Authorization Code.', 'wordpress-seo-premium' ) . "</p>\n";
					echo "<a href='javascript:wpseo_gwt_open_authorize_code_window(\"{$oath_url}\");'>" . __( 'Click here to get a Google Authorization Code', 'wordpress-seo-premium' ) . "</a>\n";

					echo "<p>" . __( 'Please enter the Authorization Code in the field below and press the Authenticate button.', 'wordpress-seo-premium' ) . "</p>\n";
					echo "<form action='' method='post'>\n";
					echo "<input type='text' name='gwt[authorization_code]' value='' />";
					echo "<input type='hidden' name='gwt[gwt_nonce]' value='" . wp_create_nonce( 'wpseo-gwt_nonce' ) . "' />";
					echo "<input type='submit' name='gwt[Submit]' value='" . __( 'Authenticate', 'wordpress-seo-premium' ) . "' class='button-primary' />";
					echo "</form>\n";
				}

				?>
			</div>
			<div id="settings" class="wpseotab">
				<h2>Google Webmaster Tools Settings</h2>

				<form action="<?php echo admin_url( 'options.php' ); ?>" method="post">
					<?php
					settings_fields( 'yoast_wpseo_gwt_options' );
					Yoast_Form::get_instance()->set_option('wpseo-premium-gwt');

					// Get the sites
					$service = new WPSEO_GWT_Service( $gwt_client );
					$sites   = $service->get_sites();

					echo Yoast_Form::get_instance()->select( 'profile', __( 'Profile', 'wordpress-seo-premium' ), $sites );

					?>

					<p class="submit">
						<input type="submit" name="submit" id="submit" class="button button-primary"
						       value="<?php _e( 'Save Changes', 'wordpress-seo-premium' ); ?>">
					</p>
				</form>

			</div>
		</div>
		<br class="clear">
		<?php

		// Admin footer
		Yoast_Form::get_instance()->admin_footer( false );
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
		if ( isset( $_GET['error'] ) && $_GET['error'] == '1' ) {
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
			'option'  => 'errors_per_page'
		) );
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