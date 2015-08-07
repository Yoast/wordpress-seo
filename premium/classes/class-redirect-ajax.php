<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Ajax
 */
class WPSEO_Redirect_Ajax {

	/**
	 * @var WPSEO_Redirect_Manager
	 */
	private $redirect_manager;

	/**
	 * @param WPSEO_Redirect_Manager $redirect_manager
	 * @param string			     $hook_suffix
	 */
	public function __construct( WPSEO_Redirect_Manager $redirect_manager, $hook_suffix ) {
		$this->redirect_manager = $redirect_manager;

		$this->set_hooks( $hook_suffix );
	}

	/**
	 * Function that handles the AJAX 'wpseo_save_redirect' action
	 */
	public function ajax_handle_redirect_save() {

		// Check nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$this->permission_check();

		// Save the redirect.
		if ( $old_redirect_post = filter_input( INPUT_POST, 'old_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY )  && $new_redirect_post = filter_input( INPUT_POST, 'new_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) {

			// Decode old redirect.
			$old_redirect = array(
				'key'   => trim( htmlspecialchars_decode( urldecode( $old_redirect_post['key'] ) ) ),
				'value' => trim( htmlspecialchars_decode( urldecode( $old_redirect_post['value'] ) ) ),
				'type'  => urldecode( $old_redirect_post['type'] ),
			);

			// Decode new redirect.
			$new_redirect = array(
				'key'   => trim( htmlspecialchars_decode( urldecode( $new_redirect_post['key'] ) ) ),
				'value' => trim( htmlspecialchars_decode( urldecode( $new_redirect_post['value'] ) ) ),
				'type'  => urldecode( $new_redirect_post['type'] ),
			);

			// Save redirects in database.
			$this->redirect_manager->save_redirect( $old_redirect, $new_redirect );
		}

		// Response.
		wp_die( '1' );
	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_handle_redirect_delete() {

		// Check nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$this->permission_check();

		// Delete the redirect.
		if ( $redirect_post = filter_input( INPUT_POST, 'redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) {
			$redirect = htmlspecialchars_decode( urldecode( $redirect_post['key'] ) );

			$this->redirect_manager->delete_redirect( array( trim( $redirect ) ) );
		}

		// Response.
		wp_die( esc_attr( strip_tags( filter_input( INPUT_POST, 'id' ) ) ) );
	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_handle_redirect_create() {

		// Check nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$this->permission_check();

		// Save the redirect.
		if ( ( $old_url_post = filter_input( INPUT_POST, 'old_url' ) ) != '' && ( $new_url_post = filter_input( INPUT_POST, 'new_url' ) ) != '' && ( $type = filter_input( INPUT_POST, 'type' ) ) != '' ) {
			$old_url = htmlspecialchars_decode( urldecode( $old_url_post ) );
			$new_url = htmlspecialchars_decode( urldecode( $new_url_post ) );

			$this->redirect_manager->create_redirect( trim( $old_url ), trim( $new_url ), $type );
		}

		$response = array(
			'id'      => filter_input( INPUT_POST, 'id' ),
			'old_url' => $old_url_post,
			'new_url' => $new_url_post,
		);

		// Response.
		wp_die( json_encode( $response ) );
	}

	/**
	 * Setting the AJAX hooks
	 *
	 * @param string $hook_suffix
	 */
	private function set_hooks( $hook_suffix ) {
		add_action( 'wp_ajax_wpseo_save_redirect_' . $hook_suffix, array( $this, 'ajax_handle_redirect_save' ) );
		add_action( 'wp_ajax_wpseo_delete_redirect_' . $hook_suffix, array( $this, 'ajax_handle_redirect_delete' ) );
		add_action( 'wp_ajax_wpseo_create_redirect_' . $hook_suffix, array( $this, 'ajax_handle_redirect_create' ) );
	}

	/**
	 * Checks whether the current user is allowed to do what he's doing
	 */
	private function permission_check() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}
	}

}
