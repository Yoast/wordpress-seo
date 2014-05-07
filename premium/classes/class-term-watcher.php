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
			$message = sprintf( __( "WordPress SEO Premium created a redirect from the old post URL to the new post URL. <a href='%s'>Click here to undo this</a>.", 'wordpress-seo' ), 'javascript:wpseo_undo_redirect("' . urlencode( $old_url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '");' );

			// Add the message to the notifications center
			Yoast_Notification_Center::add_notice( new Yoast_Notification( $message ) );

		}

	}

}