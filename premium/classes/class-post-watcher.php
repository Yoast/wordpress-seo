<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_Post_Watcher {

	public function __construct() {
	}

	/**
	 * Add an extra field to post edit screen so we know the old url in the 'post_updated' hook
	 */
	public function old_url_field() {
		global $post;
		if ( null != $post ) {

			$url = parse_url( get_permalink() );
			$url = $url['path'];
			echo '<input type="hidden" name="wpseo_old_url" value="'.esc_attr( $url ).'"/>';

		}

	}

	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param $post_id
	 * @param $post
	 * @param $post_before
	 */
	public function detect_slug_change( $post_id, $post, $post_before ) {

		// Get the new URL
		$new_url = parse_url( get_permalink( $post_id ) );
		$new_url = $new_url['path'];

		// Get the old URL
		$old_url = esc_url( $_POST['wpseo_old_url'] );

		// Get the site URL
		$site   = parse_url( get_site_url() );

		// Check if we should create a redirect
		if ( in_array( $post->post_status, array( 'publish', 'static' ) ) && $old_url != $new_url && $old_url != '/' && ( !isset( $site['path'] ) || ( isset( $site['path'] ) && $old_url != $site['path'].'/' ) ) ) {

			// The URL redirect manager
			$redirect_manager = new WPSEO_URL_Redirect_Manager();

			// Create the redirect
			$redirect_manager->create_redirect( $old_url, $new_url );
		}

	}

}