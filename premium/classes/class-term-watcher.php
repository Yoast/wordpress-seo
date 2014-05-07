<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_Term_Watcher {

	public function __construct() {
	}

	/**
	 * Add an extra field to term edit screen
	 *
	 * @param $tag
	 * @oaram $taxonomy
	 */
	public function old_url_field( $tag, $taxonomy ) {

		// Use the correct URL path
		$url = parse_url( get_term_link( $tag, $taxonomy ) );
		$url = $url['path'];

		echo '<input type="hidden" name="wpseo_old_url" value="' . esc_attr( $url ) . '"/>';

	}

	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param $term_id
	 * @param $tt_id
	 * @param $taxonomy
	 */
	public function detect_slug_change( $term_id, $tt_id, $taxonomy ) {

		// Check if the old page is set
		if ( ! isset( $_POST['wpseo_old_url'] ) ) {
			return;
		}

		// Get the new URL
		$new_url = parse_url( get_term_link( $term_id, $taxonomy ) );
		$new_url = $new_url['path'];

		// Get the old URL
		$old_url = esc_url( $_POST['wpseo_old_url'] );

		// Get the site URL
		$site = parse_url( get_site_url() );

		// Check if we should create a redirect
		if ( $old_url != $new_url && $old_url != '/' && ( ! isset( $site['path'] ) || ( isset( $site['path'] ) && $old_url != $site['path'] . '/' ) ) ) {

			// The URL redirect manager
			$redirect_manager = new WPSEO_URL_Redirect_Manager();

			// Create the redirect
			$redirect_manager->create_redirect( $old_url, $new_url );

			// Format the message
			$message = sprintf( __( "WordPress SEO Premium created a <a href='%s'>redirect</a> from the old term URL to the new term URL. <a href='%s'>Click here to undo this</a>.", 'wordpress-seo' ), admin_url( 'admin.php?page=wpseo_redirects&s=' . urlencode( $old_url ) ), 'javascript:wpseo_undo_redirect("' . urlencode( $old_url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '");' );

			// Add the message to the notifications center
			Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $message ) );

		}

	}

	/**
	 * Offer to create a redirect from the term that is about to get deleted
	 *
	 * @param $term_id
	 */
	public function detect_term_delete( $term_id ) {

		global $wpdb;

		// Get the term and taxonomy from the term_taxonomy table
		$term_row = $wpdb->get_row( $wpdb->prepare( "SELECT `term_id`, `taxonomy` FROM `" . $wpdb->term_taxonomy . "` WHERE `term_taxonomy_id` = %d ", $term_id ) );

		// Check result
		if ( null != $term_row ) {

			// Get the URL
			$url = parse_url( get_term_link( get_term( $term_row->term_id, $term_row->taxonomy ), $term_row->taxonomy ) );
			$url = $url['path'];

			// Format the message
			$message = sprintf( __( "WordPress SEO Premium detected that you deleted a term. <a href='%s'>Click here to create a redirect from the old term URL</a>.", 'wordpress-seo' ), 'javascript:wpseo_create_redirect("' . urlencode( $url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '");' );

			// Add the message to the notifications center
			Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $message ) );

		}


	}

}