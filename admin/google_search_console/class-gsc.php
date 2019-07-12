<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\admin\google_search_console
 */

/**
 * Class WPSEO_GSC.
 */
class WPSEO_GSC implements WPSEO_WordPress_Integration {

	/**
	 * The option where data will be stored.
	 *
	 * @var string
	 */
	const OPTION_WPSEO_GSC = 'wpseo-gsc';

	/**
	 * Holds the service instance.
	 *
	 * @var WPSEO_GSC_Service
	 */
	private $service;

	/**
	 * Holds the category filter instance.
	 *
	 * @var WPSEO_GSC_Category_Filters
	 */
	protected $category_filter;

	/**
	 * Holds the issues instance.
	 *
	 * @var WPSEO_GSC_Issues
	 */
	protected $issue_fetch;

	/**
	 * Current platform.
	 *
	 * @var string
	 */
	private $platform;

	/**
	 * Current category.
	 *
	 * @var string
	 */
	private $category;

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Setting the screen option.
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_search_console' ) {

			if ( filter_input( INPUT_GET, 'tab' ) !== 'settings' && ! $this->has_profile() ) {
				wp_redirect( add_query_arg( 'tab', 'settings' ) );
				exit;
			}

			add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );
			add_filter( 'set-screen-option', array( $this, 'set_screen_option' ), 11, 3 );

			$this->set_dependencies();
			$this->request_handler();
		}

		add_action( 'admin_init', array( $this, 'register_gsc_notification' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Handles the dashboard notification.
	 *
	 * If the Google Search Console has no credentials, show a notification
	 * for the user to give them a heads up. This message is dismissable.
	 *
	 * @return void
	 */
	public function register_gsc_notification() {
		$notification        = $this->get_profile_notification();
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification( $notification );
	}

	/**
	 * Builds the notification used when GSC is not connected to a profile.
	 *
	 * @return Yoast_Notification The notification.
	 */
	private function get_profile_notification() {
		return new Yoast_Notification(
			sprintf(
				/* translators: 1: link open tag; 2: link close tag. */
				__( 'Don\'t miss your crawl errors: %1$sconnect with Google Search Console here%2$s.', 'wordpress-seo' ),
				'<a href="' . admin_url( 'admin.php?page=wpseo_search_console&tab=settings' ) . '">',
				'</a>'
			),
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-dismiss-gsc',
				'capabilities' => 'wpseo_manage_options',
			)
		);
	}

	/**
	 * Makes sure the settings will be registered, so data can be stored.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting( 'yoast_wpseo_gsc_options', self::OPTION_WPSEO_GSC );
	}

	/**
	 * Outputs the HTML for the redirect page.
	 *
	 * @return void
	 */
	public function display() {
		require_once WPSEO_PATH . 'admin/google_search_console/views/gsc-display.php';
	}

	/**
	 * Displays the table.
	 *
	 * @return void
	 */
	public function display_table() {
		// The list table.
		$list_table = new WPSEO_GSC_Table( $this->platform, $this->category, $this->issue_fetch->get_issues() );

		// Adding filter to display the category filters.
		add_filter( 'views_' . $list_table->get_screen_id(), array( $this->category_filter, 'as_array' ) );

		// Preparing and displaying the table.
		$list_table->prepare_items();
		$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-crawl-issues-search' );
		$list_table->display();
	}

	/**
	 * Loads the admin redirects scripts.
	 *
	 * @return void
	 */
	public function page_scripts() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'admin-gsc' );
		$asset_manager->enqueue_style( 'metabox-css' );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-gsc', 'wpseoAdminL10n', WPSEO_Utils::get_admin_l10n() );

		$screen_options = array(
			'label'   => __( 'Crawl errors per page', 'wordpress-seo' ),
			'default' => 50,
			'option'  => 'errors_per_page',
		);
		add_screen_option( 'per_page', $screen_options );
	}

	/**
	 * Sets the screen options.
	 *
	 * @param string $status Status string.
	 * @param string $option Option key.
	 * @param string $value  Value to return.
	 *
	 * @return mixed The screen option value. False when not errors_per_page.
	 */
	public function set_screen_option( $status, $option, $value ) {
		if ( 'errors_per_page' === $option ) {
			return $value;
		}

		return false;
	}

	/**
	 * Handles the POST and GET requests.
	 *
	 * @return void
	 */
	private function request_handler() {

		// List the table search post to a get.
		$this->list_table_search_post_to_get();

		// Catch the authorization code POST.
		$this->catch_authentication_post();

		// Is there a reset post than we will remove the posts and data.
		if ( filter_input( INPUT_GET, 'gsc_reset' ) ) {
			// Clear the google data.
			WPSEO_GSC_Settings::clear_data( $this->service );

			// Adding notification to the notification center.
			/* Translators: %1$s: expands to Google Search Console. */
			$this->add_notification( sprintf( __( 'The %1$s data has been removed. You will have to reauthenticate if you want to retrieve the data again.', 'wordpress-seo' ), 'Google Search Console' ), Yoast_Notification::UPDATED );

			// Directly output the notifications.
			wp_redirect( remove_query_arg( 'gsc_reset' ) );
			exit;
		}

		// Reloads al the issues.
		if ( wp_verify_nonce( filter_input( INPUT_POST, 'reload-crawl-issues-nonce' ), 'reload-crawl-issues' ) && filter_input( INPUT_POST, 'reload-crawl-issues' ) ) {
			// Reloading all the issues.
			WPSEO_GSC_Settings::reload_issues();

			// Adding the notification.
			$this->add_notification( __( 'The issues have been successfully reloaded!', 'wordpress-seo' ), Yoast_Notification::UPDATED );

			// Directly output the notifications.
			Yoast_Notification_Center::get()->display_notifications();
		}

		// Catch bulk action request.
		new WPSEO_GSC_Bulk_Action();
	}

	/**
	 * Catches the redirects search post and redirect it to a search get.
	 *
	 * @return void
	 */
	private function list_table_search_post_to_get() {
		$search_string = filter_input( INPUT_POST, 's' );

		if ( $search_string === null ) {
			return;
		}

		// When there is nothing being search and there is no search param in the url, break this method.
		if ( $search_string === '' && filter_input( INPUT_GET, 's' ) === null ) {
			return;
		}

		$url = ( $search_string !== '' ) ? add_query_arg( 's', $search_string ) : remove_query_arg( 's' );

		// Do the redirect.
		wp_redirect( $url );
		exit;
	}

	/**
	 * Catches the authentication post.
	 *
	 * @return void
	 */
	private function catch_authentication_post() {
		$gsc_values = filter_input( INPUT_POST, 'gsc', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		// Catch the authorization code POST.
		if ( ! empty( $gsc_values['authorization_code'] ) && wp_verify_nonce( $gsc_values['gsc_nonce'], 'wpseo-gsc_nonce' ) ) {
			if ( ! WPSEO_GSC_Settings::validate_authorization( trim( $gsc_values['authorization_code'] ), $this->service->get_client() ) ) {
				$this->add_notification( __( 'Incorrect Google Authorization Code.', 'wordpress-seo' ), Yoast_Notification::ERROR );
			}

			// Redirect user to prevent a post resubmission which causes an oauth error.
			wp_redirect( admin_url( 'admin.php' ) . '?page=' . esc_attr( filter_input( INPUT_GET, 'page' ) ) . '&tab=settings' );
			exit;
		}
	}

	/**
	 * Adds notification to the yoast notification center.
	 *
	 * @param string $message Message string.
	 * @param string $type    Message type.
	 *
	 * @return void
	 */
	private function add_notification( $message, $type ) {
		Yoast_Notification_Center::get()->add_notification(
			new Yoast_Notification( $message, array( 'type' => $type ) )
		);
	}

	/**
	 * Sets the dependencies which will be used one this page.
	 *
	 * @return void
	 */
	private function set_dependencies() {
		// Setting the service object.
		$this->service = new WPSEO_GSC_Service( WPSEO_GSC_Settings::get_profile() );

		// Setting the platform.
		$this->platform = WPSEO_GSC_Mapper::get_current_platform( 'tab' );

		// Loading the issue counter.
		$issue_count = new WPSEO_GSC_Count( $this->service );
		$issue_count->fetch_counts();

		// Loading the category filters.
		$this->category_filter = new WPSEO_GSC_Category_Filters( $issue_count->get_platform_counts( $this->platform ) );

		// Setting the current category.
		$this->category = $this->category_filter->get_category();

		// Listing the issues.
		$issue_count->list_issues( $this->platform, $this->category );

		// Fetching the issues.
		$this->issue_fetch = new WPSEO_GSC_Issues( $this->platform, $this->category, $issue_count->get_issues() );
	}

	/**
	 * Sets the tab help on top of the screen.
	 *
	 * @return void
	 */
	public function set_help() {
		$screen = get_current_screen();

		if ( $screen === null ) {
			return;
		}

		$screen->add_help_tab(
			array(
				'id'      => 'basic-help',
				'title'   => __( 'Issue categories', 'wordpress-seo' ),
				'content' => '<p><strong>' . __( 'Desktop', 'wordpress-seo' ) . '</strong><br />' . __( 'Errors that occurred when your site was crawled by Googlebot.', 'wordpress-seo' ) . '</p>'
							. '<p><strong>' . __( 'Smartphone', 'wordpress-seo' ) . '</strong><br />' . __( 'Errors that occurred only when your site was crawled by Googlebot-Mobile (errors didn\'t appear for desktop).', 'wordpress-seo' ) . '</p>'
							. '<p><strong>' . __( 'Feature phone', 'wordpress-seo' ) . '</strong><br />' . __( 'Errors that only occurred when your site was crawled by Googlebot for feature phones (errors didn\'t appear for desktop).', 'wordpress-seo' ) . '</p>',
			)
		);
	}

	/**
	 * Checks if a Google Search Console profile has been set.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True when profile has been set.
	 */
	protected function has_profile() {
		return ( WPSEO_GSC_Settings::get_profile() !== '' );
	}

	/**
	 * Run init logic.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 9.5
	 *
	 * @return void
	 */
	public function init() {
		_deprecated_function( __METHOD__, 'WPSEO 9.5' );
	}
}
