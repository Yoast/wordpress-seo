<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Function used from AJAX calls, takes it variables from $_POST, dies on exit.
 *
 * @return void
 */
function wpseo_set_option() {
	if ( ! current_user_can( 'manage_options' ) ) {
		exit( '-1' );
	}

	check_ajax_referer( 'wpseo-setoption' );

	if ( ! isset( $_POST['option'] ) || ! is_string( $_POST['option'] ) ) {
		exit( '-1' );
	}

	$option = sanitize_text_field( wp_unslash( $_POST['option'] ) );
	if ( $option !== 'page_comments' ) {
		exit( '-1' );
	}

	update_option( $option, 0 );
	exit( '1' );
}

add_action( 'wp_ajax_wpseo_set_option', 'wpseo_set_option' );

/**
 * Since 3.2 Notifications are dismissed in the Notification Center.
 */
add_action( 'wp_ajax_yoast_dismiss_notification', [ 'Yoast_Notification_Center', 'ajax_dismiss_notification' ] );

/**
 * Function used to remove the admin notices for several purposes, dies on exit.
 *
 * @return void
 */
function wpseo_set_ignore() {
	if ( ! current_user_can( 'manage_options' ) ) {
		exit( '-1' );
	}

	check_ajax_referer( 'wpseo-ignore' );

	if ( ! isset( $_POST['option'] ) || ! is_string( $_POST['option'] ) ) {
		exit( '-1' );
	}

	$ignore_key = sanitize_text_field( wp_unslash( $_POST['option'] ) );
	WPSEO_Options::set( 'ignore_' . $ignore_key, true );

	exit( '1' );
}

add_action( 'wp_ajax_wpseo_set_ignore', 'wpseo_set_ignore' );

/**
 * Retrieves the post ids where the keyword is used before as well as the types of those posts.
 *
 * @return void
 */
function ajax_get_keyword_usage_and_post_types() {
	check_ajax_referer( 'wpseo-keyword-usage-and-post-types', 'nonce' );

	if ( ! isset( $_POST['post_id'], $_POST['keyword'] ) || ! is_string( $_POST['keyword'] ) ) {
		exit( '-1' );
	}

	// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- We are casting to an integer.
	$post_id = (int) wp_unslash( $_POST['post_id'] );

	if ( $post_id === 0 || ! current_user_can( 'edit_post', $post_id ) ) {
		exit( '-1' );
	}

	$keyword = sanitize_text_field( wp_unslash( $_POST['keyword'] ) );

	$post_ids = WPSEO_Meta::keyword_usage( $keyword, $post_id );

	$return_object = [
		'keyword_usage' => $post_ids,
		'post_types'    => WPSEO_Meta::post_types_for_ids( $post_ids ),
	];

	wp_die(
		// phpcs:ignore WordPress.Security.EscapeOutput -- Reason: WPSEO_Utils::format_json_encode is safe.
		WPSEO_Utils::format_json_encode( $return_object ),
	);
}

add_action( 'wp_ajax_get_focus_keyword_usage_and_post_types', 'ajax_get_keyword_usage_and_post_types' );

/**
 * Retrieves the keyword for the keyword doubles of the termpages.
 *
 * @return void
 */
function ajax_get_term_keyword_usage() {
	check_ajax_referer( 'wpseo-keyword-usage', 'nonce' );

	if ( ! isset( $_POST['post_id'], $_POST['keyword'], $_POST['taxonomy'] ) || ! is_string( $_POST['keyword'] ) || ! is_string( $_POST['taxonomy'] ) ) {
		wp_die( -1 );
	}

	// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Reason: We are casting the unsafe input to an integer.
	$post_id = (int) wp_unslash( $_POST['post_id'] );

	if ( $post_id === 0 ) {
		wp_die( -1 );
	}

	$keyword       = sanitize_text_field( wp_unslash( $_POST['keyword'] ) );
	$taxonomy_name = sanitize_text_field( wp_unslash( $_POST['taxonomy'] ) );

	$taxonomy = get_taxonomy( $taxonomy_name );

	if ( ! $taxonomy ) {
		wp_die( 0 );
	}

	if ( ! current_user_can( $taxonomy->cap->edit_terms ) ) {
		wp_die( -1 );
	}

	$usage = WPSEO_Taxonomy_Meta::get_keyword_usage( $keyword, $post_id, $taxonomy_name );

	// Normalize the result so it is the same as the post keyword usage AJAX request.
	$usage = $usage[ $keyword ];

	wp_die(
		// phpcs:ignore WordPress.Security.EscapeOutput -- Reason: WPSEO_Utils::format_json_encode is safe.
		WPSEO_Utils::format_json_encode( $usage ),
	);
}

add_action( 'wp_ajax_get_term_keyword_usage', 'ajax_get_term_keyword_usage' );

/**
 * Registers hooks for all AJAX integrations.
 *
 * @return void
 */
function wpseo_register_ajax_integrations() {
	$integrations = [ new Yoast_Network_Admin() ];

	foreach ( $integrations as $integration ) {
		$integration->register_ajax_hooks();
	}
}

wpseo_register_ajax_integrations();

new WPSEO_Shortcode_Filter();

new WPSEO_Taxonomy_Columns();
