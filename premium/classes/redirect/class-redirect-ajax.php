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
	 * @var string Format of the redirect, might be plain or regex.
	 */
	private $redirect_format;

	/**
	 * @var array The options that can be passed as option argument for filter_input.
	 */
	private $filter_options = array( 'options' => array( 'default' => '' ) );

	/**
	 * Setting up the object by instantiate the redirect manager and setting the hooks.
	 *
	 * @param string $redirect_format The redirects format.
	 */
	public function __construct( $redirect_format) {
		$this->redirect_manager = new WPSEO_Redirect_Manager( $redirect_format );
		$this->redirect_format  = $redirect_format;

		$this->set_hooks( $redirect_format );
	}

	/**
	 * Function that handles the AJAX 'wpseo_add_redirect' action
	 */
	public function ajax_add_redirect() {
		$this->valid_ajax_check();

		// Save the redirect.
		$redirect  = $this->get_redirect_from_post( 'redirect' );
		$validator = new WPSEO_Redirect_Validator();

		// The method always returns the added redirect.
		if ( $validator->validate( $redirect ) && $this->redirect_manager->create_redirect( $redirect ) ) {
			$response = array(
				'origin' => $redirect->get_origin(),
				'target' => $redirect->get_target(),
				'type'   => $redirect->get_type(),
			);
		}

		// Set the value error.
		$response['error'] = $validator->get_error();

		// Response.
		wp_die( WPSEO_Utils::json_encode( $response ) );
	}

	/**
	 * Function that handles the AJAX 'wpseo_update_redirect' action
	 */
	public function ajax_update_redirect() {

		$this->valid_ajax_check();

		$current_redirect = $this->get_redirect_from_post( 'old_redirect' );
		$new_redirect     = $this->get_redirect_from_post( 'new_redirect' );
		$validator        = new WPSEO_Redirect_Validator();

		// The method always returns the added redirect.
		if ( $validator->validate( $new_redirect, $current_redirect ) && $this->redirect_manager->update_redirect( $current_redirect, $new_redirect ) ) {
			$response = array(
				'origin' => $new_redirect->get_origin(),
				'target' => $new_redirect->get_target(),
				'type'   => $new_redirect->get_type(),
			);
		}

		// Set the value error.
		$response['error'] = $validator->get_error();

		// Response.
		wp_die( WPSEO_Utils::json_encode( $response ) );
	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_delete_redirect() {

		$this->valid_ajax_check();

		$response = array();

		$current_redirect = $this->get_redirect_from_post( 'redirect' );

		// Delete the redirect.
		if ( ! empty( $current_redirect ) ) {
			$this->redirect_manager->delete_redirects( array( $current_redirect ) );
		}

		// Response.
		wp_die( WPSEO_Utils::json_encode( $response ) );
	}

	/**
	 * Setting the AJAX hooks
	 *
	 * @param string $hook_suffix The piece that will be stitched after the hooknames.
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
	 * Get the redirect from the post values
	 *
	 * @param string $post_value The key where the post values are located in the $_POST.
	 *
	 * @return WPSEO_Redirect
	 */
	private function get_redirect_from_post( $post_value ) {
		$post_values = filter_input( INPUT_POST, $post_value, FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		return new WPSEO_Redirect(
			$this->sanitize_url( $post_values['origin'] ),
			$this->sanitize_url( $post_values['target'] ),
			urldecode( $post_values['type'] ),
			$this->redirect_format
		);
	}

	/**
	 * Sanitize the URL for displaying on the window
	 *
	 * @param string $url The url to sanitize.
	 *
	 * @return string
	 */
	private function sanitize_url( $url ) {
		return trim( htmlspecialchars_decode( rawurldecode( $url ) ) );
	}

}
