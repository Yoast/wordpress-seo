<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Ajax
 */
class WPSEO_GSC_Ajax {

	/**
	 * Setting the AJAX hooks for GSC
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_mark_fixed_crawl_issue',  array( $this, 'ajax_mark_as_fixed' ) );
		add_action( 'wp_ajax_wpseo_dismiss_gsc', array( $this, 'dismiss_notice' ) );
		add_action( 'wp_ajax_wpseo_save_auth_code', array( $this, 'save_auth_code' ) );
		add_action( 'wp_ajax_wpseo_clear_auth_code', array( $this, 'clear_auth_code' ) );
		add_action( 'wp_ajax_wpseo_get_profiles', array( $this, 'get_profiles' ) );
	}

	/**
	 * This method will be access by an AJAX request and will mark an issue as fixed.
	 *
	 * First it will do a request to the Google API
	 */
	public function ajax_mark_as_fixed() {
		if ( $this->valid_nonce() ) {
			$marker = new WPSEO_GSC_Marker( filter_input( INPUT_POST, 'url' ) );

			wp_die( $marker->get_response() );
		}

		wp_die( 'false' );
	}

	/**
	 * Handle the AJAX request and dismiss the GSC notice
	 */
	public function dismiss_notice() {
		check_ajax_referer( 'dismiss-gsc-notice' );

		update_user_meta( get_current_user_id(), 'wpseo_dismissed_gsc_notice', true );

		wp_die( 'true' );
	}

	/**
	 * Saves the authorization code.
	 */
	public function save_auth_code() {
		if ( ! $this->valid_nonce() ) {
			wp_die( '0' );
		}

		// Validate the authorization.
		$service                = $this->get_service();
		$authorization_code     = filter_input( INPUT_POST, 'authorization' );
		$is_authorization_valid = WPSEO_GSC_Settings::validate_authorization( $authorization_code, $service->get_client() );
		if ( ! $is_authorization_valid ) {
			wp_die( '0' );
		}

		$this->get_profiles();
	}

	/**
	 * Clears all authorization data.
	 */
	public function clear_auth_code() {
		if ( ! $this->valid_nonce() ) {
			wp_die( '0' );
		}

		$service = $this->get_service();

		WPSEO_GSC_Settings::clear_data( $service );

		$this->get_profiles();
	}

	/**
	 * Check if posted nonce is valid and return true if it is
	 *
	 * @return mixed
	 */
	private function valid_nonce() {
		return wp_verify_nonce( filter_input( INPUT_POST, 'ajax_nonce' ), 'wpseo-gsc-ajax-security' );
	}

	/**
	 * Returns an instance of the Google Search Console service.
	 *
	 * @return WPSEO_GSC_Service
	 */
	private function get_service() {
		return new WPSEO_GSC_Service();
	}

	/**
	 * Prints a JSON encoded string with the current profile config.
	 */
	private function get_profiles() {
		$component = new WPSEO_Config_Component_Connect_Google_Search_Console();

		wp_die( wp_json_encode( $component->get_data() ) );
	}
}
