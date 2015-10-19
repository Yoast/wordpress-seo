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
	 * @var array The options that can be passed as option argument for filter_input.
	 */
	private $filter_options = array( 'options' => array( 'default' => '' ) );

	/**
	 * @var WPSEO_Redirect_Validator
	 */
	private $validator;

	/**
	 * @param WPSEO_Redirect_Manager $redirect_manager
	 * @param string                 $hook_suffix
	 * @param bool                   $sanitize_slash
	 */
	public function __construct( WPSEO_Redirect_Manager $redirect_manager, $hook_suffix, $sanitize_slash = false ) {
		$this->redirect_manager = $redirect_manager;
		$this->validator        = new WPSEO_Redirect_Validator( $sanitize_slash, $this->redirect_manager->get_redirects() );

		$this->set_hooks( $hook_suffix );
	}

	/**
	 * Function that handles the AJAX 'wpseo_add_redirect' action
	 */
	public function ajax_add_redirect() {

		$this->valid_ajax_check();

		// Save the redirect.
		$old_url_post = filter_input( INPUT_POST, 'old_url', FILTER_DEFAULT, $this->filter_options );
		$new_url_post = filter_input( INPUT_POST, 'new_url', FILTER_DEFAULT, $this->filter_options );
		$type         = filter_input( INPUT_POST, 'type', FILTER_DEFAULT, $this->filter_options );


		$this->validator->validate( $old_url_post, $new_url_post, $type, true );

		$response  = array();

		// When $validation is false, there is no error found.
		if ( ! $this->validator->has_error() ) {
			$old_url = $this->validator->sanitize_url( $old_url_post );
			$new_url = $this->validator->sanitize_url( $new_url_post );

			// The method always returns the added redirect.
			$redirect = $this->redirect_manager->create_redirect( $old_url, $new_url, $type );

			$response = array(
				'old_redirect'  => $redirect['redirect'],
				'new_redirect'  => $redirect['url'],
				'redirect_type' => $redirect['type'],
			);
		}

		// Set the value error.
		$response['error'] = $this->validator->get_error();

		// Response.
		wp_die( json_encode( $response ) );
	}

	/**
	 * Function that handles the AJAX 'wpseo_update_redirect' action
	 */
	public function ajax_update_redirect() {

		$this->valid_ajax_check();

		// Save the redirect.
		$old_redirect = $this->validator->sanitize_url(
			filter_input( INPUT_POST, 'old_redirect', FILTER_DEFAULT, $this->filter_options )
		);

		// Decode new redirect.
		$new_redirect = $this->decode_redirect(
			filter_input( INPUT_POST, 'new_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY )
		);

		$this->validator->validate( $new_redirect['key'], $new_redirect['value'], $new_redirect['type'], $old_redirect );

		$response  = array();

		if ( ! $this->validator->has_error() ) {
			// Save redirects in database.
			$redirect = $this->redirect_manager->update_redirect( $old_redirect, $new_redirect );

			$response = array(
				'old_redirect'  => $redirect['redirect'],
			);
		}

		// Set the value error.
		$response['error'] = $this->validator->get_error();

		// Response.
		wp_die( json_encode( $response ) );
	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_delete_redirect() {

		$this->valid_ajax_check();

		$response = array();

		// Delete the redirect.
		if ( $redirect_post = filter_input( INPUT_POST, 'redirect', FILTER_DEFAULT, $this->filter_options ) ) {
			$redirect = $this->validator->sanitize_url( $redirect_post );

			$this->redirect_manager->delete_redirects( array( trim( $redirect ) ) );
		}

		// Response.
		wp_die( json_encode( $response ) );
	}

	/**
	 * Setting the AJAX hooks
	 *
	 * @param string $hook_suffix
	 */
	private function set_hooks( $hook_suffix ) {
		// Add the new redirect.
		add_action( 'wp_ajax_wpseo_add_redirect_' . $hook_suffix, array( $this, 'ajax_add_redirect' ) );

		// Update an existing redirect.
		add_action( 'wp_ajax_wpseo_update_redirect_' . $hook_suffix, array( $this, 'ajax_update_redirect' ) );

		// Delete an existing redirect.
		add_action( 'wp_ajax_wpseo_delete_redirect_' . $hook_suffix, array( $this, 'ajax_delete_redirect' ) );

		// Add URL response code check AJAX.
		if ( ! has_action( 'wp_ajax_wpseo_check_url' ) ) {
			add_action( 'wp_ajax_wpseo_check_url', array( $this, 'ajax_check_url' ) );
		}
	}

	/**
	 * Check if the posted nonce is valid and if the user has the needed rights
	 */
	private function valid_ajax_check() {
		// Check nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$this->permission_check();
	}

	/**
	 * Checks whether the current user is allowed to do what he's doing
	 */
	private function permission_check() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( '0' );
		}
	}

	/**
	 * Decode the redirect data.
	 *
	 * @param array $redirect
	 *
	 * @return array
	 */
	private function decode_redirect( array $redirect ) {
		return array(
			'key'   => $this->validator->sanitize_url( $redirect['key'] ),
			'value' => $this->validator->sanitize_url( $redirect['value'] ),
			'type'  => urldecode( $redirect['type'] ),
		);
	}

}
