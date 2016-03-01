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
		add_action( 'wp_ajax_wpseo_gsc_create_redirect_url', array( $this, 'ajax_create_redirect' ) );
		add_action( 'wp_ajax_wpseo_dismiss_gsc', array( $this, 'dismiss_notice' ) );
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
	 * Handling the request to create a new redirect from the issued URL
	 */
	public function ajax_create_redirect() {
		if ( $this->valid_nonce() && class_exists( 'WPSEO_Redirect_Manager' ) && defined( 'WPSEO_PREMIUM_PATH' ) ) {
			$redirect_manager = new WPSEO_Redirect_Manager();

			$old_url = filter_input( INPUT_POST, 'old_url' );

			// Creates the redirect.
			$redirect = new WPSEO_Redirect( $old_url, filter_input( INPUT_POST, 'new_url' ), filter_input( INPUT_POST, 'type' ) );

			if ( $redirect_manager->create_redirect( $redirect ) ) {
				if ( filter_input( INPUT_POST, 'mark_as_fixed' ) === 'true' ) {
					new WPSEO_GSC_Marker( $old_url );
				}

				wp_die( 'true' );
			}
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
	 * Check if posted nonce is valid and return true if it is
	 *
	 * @return mixed
	 */
	private function valid_nonce() {
		return wp_verify_nonce( filter_input( INPUT_POST, 'ajax_nonce' ), 'wpseo-gsc-ajax-security' );
	}
}
