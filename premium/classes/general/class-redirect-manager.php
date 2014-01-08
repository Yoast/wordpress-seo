<?php
/**
 * @package Premium\Redirect
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


class WPSEO_Redirect_Manager {

	const OPTION_REDIRECTS = 'wpseo-premium-redirects';

	public function __construct() {
	}

	/**
	 * Get the redirects
	 *
	 * @return array
	 */
	public static function get_redirects() {
		return apply_filters( 'wpseo_premium_get_redirects', get_option( self::OPTION_REDIRECTS, array() ) );
	}

	/**
	 * Save the redirects
	 *
	 * @param array	$redirects
	 */
	public static function save_redirects( $redirects ) {
		update_option( self::OPTION_REDIRECTS, apply_filters( 'wpseo_premium_save_redirects', $redirects ) );
	}

	/**
	 * Delete the redirects
	 *
	 * @param array	$delete_redirects
	 */
	public static function delete_redirects( $delete_redirects ) {

		$redirects = self::get_redirects();

		if ( count( $redirects ) > 0 ) {
			if ( is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
				foreach ( $delete_redirects as $delete_redirects ) {
					unset( $redirects[$delete_redirects] );
				}
			}
		}

		self::save_redirects( $redirects );

	}

	/**
	 * Function that handles the AJAX 'handle_redirects_save' action
	 */
	public static function ajax_handle_redirects_save() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Save redirects in database
		self::save_redirects( $_POST['redirects'] );

		// Response
		echo '1';
		exit;

	}

}
