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

		$config = array(
			'application_name' => 'WordPress SEO by Yoast Premium',
			'client_id'        => '972827778625-rvd2mfvj3fnc97es9p57vqaap2lucm3h.apps.googleusercontent.com',
			'client_secret'    => 'i32Z2SFYPdxNRALHf25uwMFW',
		);

		Yoast_Api_Libs::load_api_libraries( array( 'google' ) );

		// Create a new WPSEO GWT Google Client
		$gwt_client = new WPSEO_GWT_Client( $config );

		// Admin header
		Yoast_Form::get_instance()->admin_header( false, 'wpseo_redirects', false, 'yoast_wpseo_redirects_options' );
		?>
		<h2 class="nav-tab-wrapper" id="wpseo-tabs">
			<form action="" method="post">
				<input type="submit" name="reload-crawl-issues" id="reload-crawl-issue" class="button-primary"
					   style="float: right;" value="<?php _e( 'Reload crawl issues', 'wordpress-seo-premium' ); ?>">
			</form>
			<?php $this->platform_tabs(); ?>
		</h2>

<!--		<div class="tabwrapper>">-->
			<?php

			switch ( $this->current_tab ) {
				case 'settings' :
					?>
					<h2>Google Webmaster Tools Settings</h2>

					<form action="<?php echo admin_url( 'options.php' ); ?>" method="post">
						<?php
						settings_fields( 'yoast_wpseo_gwt_options' );
						Yoast_Form::get_instance()->set_option( 'wpseo-premium-gwt' );

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
					<?php
					break;

				default :
					// Check if there is an access token
					if ( null != $gwt_client->getAccessToken() ) {
						// echo "<h2>Google Webmaster Tools Errors</h2>\n";

						$category = '';
						if ( $filter_category = filter_input( INPUT_GET, 'category' ) ) {
							$category = "&category={$filter_category}";
						}

						// Open <form>
						echo "<form id='wpseo-crawl-issues-table-form' action='" . admin_url( 'admin.php' ) . '?page=' . esc_attr( $_GET['page'] ) . $category . "' method='post'>\n";

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
						echo '<p>' . __( 'To allow WordPress SEO Premium to fetch your Google Webmaster Tools information, please enter your Google Authorization Code.', 'wordpress-seo-premium' ) . "</p>\n";
						echo "<a href='javascript:wpseo_gwt_open_authorize_code_window(\"{$oath_url}\");'>" . __( 'Click here to get a Google Authorization Code', 'wordpress-seo-premium' ) . "</a>\n";

						echo '<p>' . __( 'Please enter the Authorization Code in the field below and press the Authenticate button.', 'wordpress-seo-premium' ) . "</p>\n";
						echo "<form action='' method='post'>\n";
						echo "<input type='text' name='gwt[authorization_code]' value='' />";
						echo "<input type='hidden' name='gwt[gwt_nonce]' value='" . wp_create_nonce( 'wpseo-gwt_nonce' ) . "' />";
						echo "<input type='submit' name='gwt[Submit]' value='" . __( 'Authenticate', 'wordpress-seo-premium' ) . "' class='button-primary' />";
						echo "</form>\n";
					}

					?>
					<!--			</div>-->
					<?php
					break;
			}
			?>

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
				// Authenticate user
				$gwt_authentication = new WPSEO_GWT_Authentication();

				if ( ! $gwt_authentication->authenticate( $_POST['gwt']['authorization_code'] ) ) {
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

		$this->current_tab = key( $platforms );
		if ( $current_platform = filter_input( INPUT_GET, 'tab' ) ) {
			$this->current_tab = $current_platform;
		}

		foreach ( $platforms as $platform_target => $platform_value ) {

			$active = '';
			if ( $this->current_tab === $platform_target ) {
				$active = ' nav-tab-active';
			}

			echo '<a class="nav-tab ' . $active . '" id="' . $platform_target . '-tab" href="' . $admin_link . $platform_target . '">' . $platform_value . '</a>';
		}
	}

	private function category_filters() {
		$categories = array(
			'auth_permissions'     => __( 'Authentication permissions', 'wordpress-seo' ),
			'many_to_one_redirect' => __( 'Many to one redirect', 'wordpress-seo' ),
			'not_followed'         => __( 'Not followed', 'wordpress-seo' ),
			'not_found'            => __( 'Not found', 'wordpress-seo' ),
			'other'                => __( 'Other', 'wordpress-seo' ),
			'roboted'              => __( 'Roboted', 'wordpress-seo' ),
			'server_error'         => __( 'Server Error', 'wordpress-seo' ),
			'soft_404'             => __( 'Soft 404', 'wordpress-seo' ),
		);

		$admin_link = admin_url( ' ?page=wpseo_webmaster_tools&platform=' );

		foreach ( $categories as $category_target => $category ) {
			echo '<a class="nav-tab" id="crawl-issues-tab" href="' . $admin_link . $category_target . '">' . $category['tab_value'] . '</a>';
		}
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