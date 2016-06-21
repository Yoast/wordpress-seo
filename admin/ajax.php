<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * @todo this whole thing should probably be a proper class.
 */

/**
 * Convenience function to JSON encode and echo results and then die
 *
 * @param array $results Results array for encoding.
 */
function wpseo_ajax_json_echo_die( $results ) {
	echo wp_json_encode( $results );
	die();
}

/**
 * Function used from AJAX calls, takes it variables from $_POST, dies on exit.
 */
function wpseo_set_option() {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	check_ajax_referer( 'wpseo-setoption' );

	$option = sanitize_text_field( filter_input( INPUT_POST, 'option' ) );
	if ( $option !== 'page_comments' ) {
		die( '-1' );
	}

	update_option( $option, 0 );
	die( '1' );
}

add_action( 'wp_ajax_wpseo_set_option', 'wpseo_set_option' );

/**
 * Since 3.2 Notifications are dismissed in the Notification Center.
 */
add_action( 'wp_ajax_yoast_dismiss_notification', array( 'Yoast_Notification_Center', 'ajax_dismiss_notification' ) );

/**
 * Function used to remove the admin notices for several purposes, dies on exit.
 */
function wpseo_set_ignore() {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	check_ajax_referer( 'wpseo-ignore' );

	$ignore_key = sanitize_text_field( filter_input( INPUT_POST, 'option' ) );

	$options                          = get_option( 'wpseo' );
	$options[ 'ignore_' . $ignore_key ] = true;
	update_option( 'wpseo', $options );

	die( '1' );
}

add_action( 'wp_ajax_wpseo_set_ignore', 'wpseo_set_ignore' );

/**
 * Hides the default tagline notice for a specific user.
 */
function wpseo_dismiss_tagline_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	check_ajax_referer( 'wpseo-dismiss-tagline-notice' );

	update_user_meta( get_current_user_id(), 'wpseo_seen_tagline_notice', 'seen' );

	die( '1' );
}

add_action( 'wp_ajax_wpseo_dismiss_tagline_notice', 'wpseo_dismiss_tagline_notice' );

/**
 * Function used to delete blocking files, dies on exit.
 */
function wpseo_kill_blocking_files() {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	check_ajax_referer( 'wpseo-blocking-files' );

	$message = 'success';
	$errors  = array();

	// Todo: Use WP_Filesystem, but not so easy to use in AJAX with credentials form still internal.
	$options = get_option( 'wpseo' );
	if ( is_array( $options['blocking_files'] ) && $options['blocking_files'] !== array() ) {
		foreach ( $options['blocking_files'] as $file ) {
			if ( is_file( $file ) ) {
				if ( ! @unlink( $file ) ) {
					$errors[] = __(
						sprintf( 'The file "%s" could not be removed. Please remove it via FTP.', $file ),
						'wordpress-seo'
					);
				}
			}

			if ( is_dir( $file ) ) {
				if ( ! @ rmdir( $file ) ) {
					$errors[] = __(
						sprintf( 'The directory "%s" could not be removed. Please remove it via FTP.', $file ),
						'wordpress-seo'
					);
				}
			}
		}
	}

	if ( $errors ) {
		$message = implode( '<br />', $errors );
	}

	die( $message );
}

add_action( 'wp_ajax_wpseo_kill_blocking_files', 'wpseo_kill_blocking_files' );

/**
 * Used in the editor to replace vars for the snippet preview
 */
function wpseo_ajax_replace_vars() {
	global $post;
	check_ajax_referer( 'wpseo-replace-vars' );

	$post = get_post( intval( filter_input( INPUT_POST, 'post_id' ) ) );
	global $wp_query;
	$wp_query->queried_object = $post;
	$wp_query->queried_object_id = $post->ID;
	$omit = array( 'excerpt', 'excerpt_only', 'title' );
	echo wpseo_replace_vars( stripslashes( filter_input( INPUT_POST, 'string' ) ), $post, $omit );
	die;
}

add_action( 'wp_ajax_wpseo_replace_vars', 'wpseo_ajax_replace_vars' );

/**
 * Save an individual SEO title from the Bulk Editor.
 */
function wpseo_save_title() {
	wpseo_save_what( 'title' );
}

add_action( 'wp_ajax_wpseo_save_title', 'wpseo_save_title' );

/**
 * Save an individual meta description from the Bulk Editor.
 */
function wpseo_save_description() {
	wpseo_save_what( 'metadesc' );
}

add_action( 'wp_ajax_wpseo_save_metadesc', 'wpseo_save_description' );

/**
 * Save titles & descriptions
 *
 * @param string $what Type of item to save (title, description).
 */
function wpseo_save_what( $what ) {
	check_ajax_referer( 'wpseo-bulk-editor' );

	$new      = filter_input( INPUT_POST, 'new_value' );
	$post_id  = intval( filter_input( INPUT_POST, 'wpseo_post_id' ) );
	$original = filter_input( INPUT_POST, 'existing_value' );

	$results = wpseo_upsert_new( $what, $post_id, $new, $original );

	wpseo_ajax_json_echo_die( $results );
}

/**
 * Helper function to update a post's meta data, returning relevant information
 * about the information updated and the results or the meta update.
 *
 * @param int    $post_id         Post ID.
 * @param string $new_meta_value  New meta value to record.
 * @param string $orig_meta_value Original meta value.
 * @param string $meta_key        Meta key string.
 * @param string $return_key      Return key string to use in results.
 *
 * @return string
 */
function wpseo_upsert_meta( $post_id, $new_meta_value, $orig_meta_value, $meta_key, $return_key ) {

	$post_id                  = intval( $post_id );
	$sanitized_new_meta_value = wp_strip_all_tags( $new_meta_value );
	$orig_meta_value          = wp_strip_all_tags( $orig_meta_value );

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

	if ( $sanitized_new_meta_value === $orig_meta_value && $sanitized_new_meta_value !== $new_meta_value ) {
		$upsert_results['status']  = 'failure';
		$upsert_results['results'] = __( 'You have used HTML in your value which is not allowed.', 'wordpress-seo' );

		return $upsert_results;
	}

	$res = update_post_meta( $post_id, $meta_key, $sanitized_new_meta_value );

	$upsert_results['status']  = ( $res !== false ) ? 'success' : 'failure';
	$upsert_results['results'] = $res;

	return $upsert_results;
}

/**
 * Save all titles sent from the Bulk Editor.
 */
function wpseo_save_all_titles() {
	wpseo_save_all( 'title' );
}

add_action( 'wp_ajax_wpseo_save_all_titles', 'wpseo_save_all_titles' );

/**
 * Save all description sent from the Bulk Editor.
 */
function wpseo_save_all_descriptions() {
	wpseo_save_all( 'metadesc' );
}

add_action( 'wp_ajax_wpseo_save_all_descriptions', 'wpseo_save_all_descriptions' );

/**
 * Utility function to save values
 *
 * @param string $what Type of item so save.
 */
function wpseo_save_all( $what ) {
	check_ajax_referer( 'wpseo-bulk-editor' );

	// @todo the WPSEO Utils class can't filter arrays in POST yet.
	$new_values      = $_POST['items'];
	$original_values = $_POST['existing_items'];

	$results = array();

	if ( is_array( $new_values ) && $new_values !== array() ) {
		foreach ( $new_values as $post_id => $new_value ) {
			$original_value = $original_values[ $post_id ];
			$results[]      = wpseo_upsert_new( $what, $post_id, $new_value, $original_value );
		}
	}
	wpseo_ajax_json_echo_die( $results );
}

/**
 * Insert a new value
 *
 * @param string $what     Item type (such as title).
 * @param int    $post_id  Post ID.
 * @param string $new      New value to record.
 * @param string $original Original value.
 *
 * @return string
 */
function wpseo_upsert_new( $what, $post_id, $new, $original ) {
	$meta_key = WPSEO_Meta::$meta_prefix . $what;

	return wpseo_upsert_meta( $post_id, $new, $original, $meta_key, $what );
}

/**
 * Handles the posting of a new FB admin.
 */
function wpseo_add_fb_admin() {
	check_ajax_referer( 'wpseo_fb_admin_nonce' );

	if ( ! current_user_can( 'manage_options' ) ) {
		die( '-1' );
	}

	$facebook_social = new Yoast_Social_Facebook();

	wp_die( $facebook_social->add_admin( filter_input( INPUT_POST, 'admin_name' ), filter_input( INPUT_POST, 'admin_id' ) ) );
}

add_action( 'wp_ajax_wpseo_add_fb_admin', 'wpseo_add_fb_admin' );

/**
 * Retrieves the keyword for the keyword doubles.
 */
function ajax_get_keyword_usage() {
	$post_id = filter_input( INPUT_POST, 'post_id' );
	$keyword = filter_input( INPUT_POST, 'keyword' );

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		die( '-1' );
	}

	wp_die(
		wp_json_encode( WPSEO_Meta::keyword_usage( $keyword, $post_id ) )
	);
}

add_action( 'wp_ajax_get_focus_keyword_usage',  'ajax_get_keyword_usage' );

/**
 * Retrieves the keyword for the keyword doubles of the termpages.
 */
function ajax_get_term_keyword_usage() {
	$post_id = filter_input( INPUT_POST, 'post_id' );
	$keyword = filter_input( INPUT_POST, 'keyword' );
	$taxonomyName = filter_input( INPUT_POST, 'taxonomy' );

	$taxonomy = get_taxonomy( $taxonomyName );

	if ( ! $taxonomy ) {
		wp_die( 0 );
	}

	if ( ! current_user_can( $taxonomy->cap->edit_terms ) ) {
		wp_die( -1 );
	}

	$usage = WPSEO_Taxonomy_Meta::get_keyword_usage( $keyword, $post_id, $taxonomyName );

	// Normalize the result so it it the same as the post keyword usage AJAX request.
	$usage = $usage[ $keyword ];

	wp_die(
		wp_json_encode( $usage )
	);
}

add_action( 'wp_ajax_get_term_keyword_usage',  'ajax_get_term_keyword_usage' );

/**
 * Removes stopword from the sample permalink that is generated in an AJAX request
 *
 * @param array  $permalink The permalink generated for this post by WordPress.
 * @param int    $post_ID The ID of the post.
 * @param string $title The title for the post that the user used.
 * @param string $name The name for the post that the user used.
 *
 * @return array
 */
function wpseo_remove_stopwords_sample_permalink( $permalink, $post_ID, $title, $name ) {
	WPSEO_Options::get_instance();
	$options = WPSEO_Options::get_options( array( 'wpseo_permalinks' ) );
	if ( $options['cleanslugs'] !== true ) {
		return $permalink;
	}

	/*
	 * If the name is empty and the title is not, WordPress will generate a slug. In that case we want to remove stop
	 * words from the slug.
	 */
	if ( empty( $name ) && ! empty( $title ) ) {
		$stop_words = new WPSEO_Admin_Stop_Words();

		// The second element is the slug.
		$permalink[1] = $stop_words->remove_in( $permalink[1] );
	}

	return $permalink;
}

add_action( 'get_sample_permalink', 'wpseo_remove_stopwords_sample_permalink', 10, 4 );

// Crawl Issue Manager AJAX hooks.
new WPSEO_GSC_Ajax;

// SEO Score Recalculations.
new WPSEO_Recalculate_Scores_Ajax;

new Yoast_Dashboard_Widget();

new Yoast_OnPage_Ajax();

new WPSEO_Shortcode_Filter();

new WPSEO_Taxonomy_Columns();


// Setting the notice for the recalculate the posts.
new Yoast_Dismissable_Notice_Ajax( 'recalculate', Yoast_Dismissable_Notice_Ajax::FOR_SITE );

/********************** DEPRECATED METHODS **********************/

/**
 * Create an export and return the URL
 *
 * @deprecated 3.3.2
 */
function wpseo_get_export() {
	_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated.' );

	wpseo_ajax_json_echo_die( '' );
}
