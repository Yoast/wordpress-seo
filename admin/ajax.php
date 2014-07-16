<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Function used from AJAX calls, takes it variables from $_POST, dies on exit.
 */
function wpseo_set_option() {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	check_ajax_referer( 'wpseo-setoption' );

	$option = sanitize_text_field( $_POST['option'] );
	if ( $option !== 'page_comments' ) {
		die( '-1' );
	}

	update_option( $option, 0 );
	die( '1' );
}

add_action( 'wp_ajax_wpseo_set_option', 'wpseo_set_option' );

/**
 * Function used to remove the admin notices for several purposes, dies on exit.
 */
function wpseo_set_ignore() {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	check_ajax_referer( 'wpseo-ignore' );

	$options                            = get_option( 'wpseo' );
	$ignore_key                         = sanitize_text_field( $_POST['option'] );
	$options[ 'ignore_' . $ignore_key ] = true;
	update_option( 'wpseo', $options );
	die( '1' );
}

add_action( 'wp_ajax_wpseo_set_ignore', 'wpseo_set_ignore' );

/**
 * Function used to delete blocking files, dies on exit.
 */
function wpseo_kill_blocking_files() {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	check_ajax_referer( 'wpseo-blocking-files' );

	$message = 'There were no files to delete.';
	$options = get_option( 'wpseo' );
	if ( is_array( $options['blocking_files'] ) && $options['blocking_files'] !== array() ) {
		$message       = 'success';
		$files_removed = 0;
		foreach ( $options['blocking_files'] as $k => $file ) {
			if ( ! @unlink( $file ) ) {
				$message = __( 'Some files could not be removed. Please remove them via FTP.', 'wordpress-seo' );
			}
			else {
				unset( $options['blocking_files'][ $k ] );
				$files_removed++;
			}
		}
		if ( $files_removed > 0 ) {
			update_option( 'wpseo', $options );
		}
	}

	die( $message );
}

add_action( 'wp_ajax_wpseo_kill_blocking_files', 'wpseo_kill_blocking_files' );

/**
 * Retrieve the suggestions from the Google Suggest API and return them to be
 * used in the suggest box within the plugin. Dies on exit.
 */
function wpseo_get_suggest() {
	check_ajax_referer( 'wpseo-get-suggest' );

	$term   = urlencode( $_GET['term'] );
	$result = wp_remote_get( 'https://www.google.com/complete/search?output=toolbar&q=' . $term );

	$return_arr = array();

	if ( ! is_wp_error( $result ) ) {
		preg_match_all( '`suggestion data="([^"]+)"/>`u', $result['body'], $matches );

		if ( isset( $matches[1] ) && ( is_array( $matches[1] ) && $matches[1] !== array() ) ) {
			foreach ( $matches[1] as $match ) {
				$return_arr[] = html_entity_decode( $match, ENT_COMPAT, 'UTF-8' );
			}
		}
	}
	echo json_encode( $return_arr );
	die();
}

add_action( 'wp_ajax_wpseo_get_suggest', 'wpseo_get_suggest' );

/**
 * Used in the editor to replace vars for the snippet preview
 */
function wpseo_ajax_replace_vars() {
	check_ajax_referer( 'wpseo-replace-vars' );

	$post = get_post( $_POST['post_id'] );
	$omit = array( 'excerpt', 'excerpt_only', 'title' );
	echo wpseo_replace_vars( $_POST['string'], $post, $omit );
	die;
}

add_action( 'wp_ajax_wpseo_replace_vars', 'wpseo_ajax_replace_vars' );

/**
 * Save an individual SEO title from the Bulk Editor.
 */
function wpseo_save_title() {
	check_ajax_referer( 'wpseo-bulk-editor' );

	$new_title      = $_POST['new_title'];
	$id             = intval( $_POST['wpseo_post_id'] );
	$original_title = $_POST['existing_title'];

	$results = wpseo_upsert_new_title( $id, $new_title, $original_title );

	echo json_encode( $results );
	die();
}

add_action( 'wp_ajax_wpseo_save_title', 'wpseo_save_title' );

/**
 * Helper function for updating an existing seo title or create a new one
 * if it doesn't already exist.
 */
function wpseo_upsert_new_title( $post_id, $new_title, $original_title ) {

	$meta_key   = WPSEO_Meta::$meta_prefix . 'title';
	$return_key = 'title';
	return wpseo_upsert_meta( $post_id, $new_title, $original_title, $meta_key, $return_key );
}

/**
 * Helper function to update a post's meta data, returning relevant information
 * about the information updated and the results or the meta update.
 */
function wpseo_upsert_meta( $post_id, $new_meta_value, $orig_meta_value, $meta_key, $return_key ) {

	$upsert_results = array(
		'status'                 => 'success',
		'post_id'                => $post_id,
		"new_{$return_key}"      => $new_meta_value,
		"original_{$return_key}" => $orig_meta_value,
	);

	$the_post = get_post( $post_id );
	if ( empty( $the_post ) ) {

		$upsert_results['status']  = 'failure';
		$upsert_results['results'] = __( 'Post doesn\'t exist.', 'wordpress-seo' );

		return $upsert_results;
	}

	$post_type_object = get_post_type_object( $the_post->post_type );
	if ( ! $post_type_object ) {

		$upsert_results['status']  = 'failure';
		$upsert_results['results'] = sprintf( __( 'Post has an invalid Post Type: %s.', 'wordpress-seo' ), $the_post->post_type );

		return $upsert_results;
	}

	if ( ! current_user_can( $post_type_object->cap->edit_posts ) ) {

		$upsert_results['status']  = 'failure';
		$upsert_results['results'] = sprintf( __( 'You can\'t edit %s.', 'wordpress-seo' ), $post_type_object->label );

		return $upsert_results;
	}

	if ( ! current_user_can( $post_type_object->cap->edit_others_posts ) && $the_post->post_author != get_current_user_id() ) {

		$upsert_results['status']  = 'failure';
		$upsert_results['results'] = sprintf( __( 'You can\'t edit %s that aren\'t yours.', 'wordpress-seo' ), $post_type_object->label );

		return $upsert_results;

	}

	$res = update_post_meta( $post_id, $meta_key, $new_meta_value );

	$upsert_results['status']  = ( $res !== false ) ? 'success' : 'failure';
	$upsert_results['results'] = $res;

	return $upsert_results;
}

/**
 * Save all titles sent from the Bulk Editor.
 */
function wpseo_save_all_titles() {
	check_ajax_referer( 'wpseo-bulk-editor' );

	$new_titles      = $_POST['titles'];
	$original_titles = $_POST['existing_titles'];

	$results = array();

	if ( is_array( $new_titles ) && $new_titles !== array() ) {
		foreach ( $new_titles as $id => $new_title ) {
			$original_title = $original_titles[ $id ];
			$results[]      = wpseo_upsert_new_title( $id, $new_title, $original_title );
		}
	}
	echo json_encode( $results );
	die();
}

add_action( 'wp_ajax_wpseo_save_all_titles', 'wpseo_save_all_titles' );

/**
 * Save an individual meta description from the Bulk Editor.
 */
function wpseo_save_description() {
	check_ajax_referer( 'wpseo-bulk-editor' );

	$new_metadesc      = $_POST['new_metadesc'];
	$id                = intval( $_POST['wpseo_post_id'] );
	$original_metadesc = $_POST['existing_metadesc'];

	$results = wpseo_upsert_new_description( $id, $new_metadesc, $original_metadesc );

	echo json_encode( $results );
	die();
}

add_action( 'wp_ajax_wpseo_save_desc', 'wpseo_save_description' );

/**
 * Helper function to create or update a post's meta description.
 */
function wpseo_upsert_new_description( $post_id, $new_metadesc, $original_metadesc ) {

	$meta_key   = WPSEO_Meta::$meta_prefix . 'metadesc';
	$return_key = 'metadesc';
	return wpseo_upsert_meta( $post_id, $new_metadesc, $original_metadesc, $meta_key, $return_key );
}

/**
 * Save all description sent from the Bulk Editor.
 */
function wpseo_save_all_descriptions() {
	check_ajax_referer( 'wpseo-bulk-editor' );

	$new_metadescs      = $_POST['metadescs'];
	$original_metadescs = $_POST['existing_metadescs'];

	$results = array();

	if ( is_array( $new_metadescs ) && $new_metadescs !== array() ) {
		foreach ( $new_metadescs as $id => $new_metadesc ) {
			$original_metadesc = $original_metadescs[ $id ];
			$results[]         = wpseo_upsert_new_description( $id, $new_metadesc, $original_metadesc );
		}
	}
	echo json_encode( $results );
	die();
}

add_action( 'wp_ajax_wpseo_save_all_descs', 'wpseo_save_all_descriptions' );
