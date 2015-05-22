<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_GWT_Settings
 */
class WPSEO_GWT_Settings {

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * @param WPSEO_GWT_Service $service
	 */
	public function __construct( WPSEO_GWT_Service $service ) {

		// Setting the service object
		$this->service = $service;

		// Check for error message
		if ( filter_input( INPUT_GET, 'error' ) === '1' ) {
			add_action( 'admin_notices', array( $this, 'admin_message_body' ) );
		}

		// Is there a reset post
		if ( filter_input( INPUT_POST, 'gwt_reset' ) ) {
			// Remove the posts with data
			$this->clear_data();
		}

		if ( filter_input( INPUT_POST, 'reload-crawl-issues' ) ) {
			$this->reload_issues();
		}

		// Catch the authorization code POST
		$this->catch_authentication_post();
	}

	/**
	 * Print Incorrect Google Authorization Code error
	 */
	public function admin_message_body() {
		?>
		<div class="error">
			<p><strong><?php _e( 'Incorrect Google Authorization Code!', 'wordpress-seo-premium' ); ?></strong></p>
		</div>
		<?php
	}

	/**
	 * Catch the authentication post
	 */
	private function catch_authentication_post() {
		$redirect_url_appendix = '';

		$gwt_values = filter_input( INPUT_POST, 'gwt', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		// Catch the authorization code POST
		if ( ! empty( $gwt_values['authorization_code'] ) && wp_verify_nonce( $gwt_values['gwt_nonce'], 'wpseo-gwt_nonce' ) ) {

			if ( trim( $gwt_values['authorization_code'] ) != '' ) {
				if ( ! $this->service->get_client()->authenticate_client( $gwt_values['authorization_code'] ) ) {
					$redirect_url_appendix = '&error=1';
				}
			}
			else {
				$redirect_url_appendix = '&error=1';
			}

			// Redirect user to prevent a post resubmission which causes an oauth error
			wp_redirect( admin_url( 'admin.php' ) . '?page=' . esc_attr( filter_input( INPUT_GET, 'page' ) ) . '&tab=settings' . $redirect_url_appendix );
			exit;
		}
	}

	/**
	 * Clear all data from the database
	 */
	private function clear_data() {
		$this->remove_issue_counts();

		// Removing all issues from the database
		$this->remove_issues();

		// Clear the service data
		$this->service->clear_data();
	}

	/**
	 * Delete the issues and their meta data from the database
	 */
	private function remove_issues() {
		global $wpdb;

		// Remove local crawl issues by running a delete query
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE 'wpseo-premium-gwt-issues-%'" );
	}

	/**
	 * Remove the issue counts
	 */
	private function remove_issue_counts() {
		// Remove the options which are holding the counts
		delete_option( WPSEO_Crawl_Issue_Count::OPTION_CI_COUNTS );
		delete_option( WPSEO_Crawl_Issue_Count::OPTION_CI_LAST_FETCH );
	}

	/**
	 * Reloading all the issues
	 */
	private function reload_issues() {

		$this->remove_issues();
		$this->remove_issue_counts();

		new WPSEO_Crawl_Issue_Count( $this->service );
	}

}