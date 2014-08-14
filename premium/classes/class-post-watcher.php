<?php

class WPSEO_Post_Watcher {

	/**
	 * Add an extra field to post edit screen so we know the old url in the 'post_updated' hook
	 *
	 * @param $post
	 */
	public function old_url_field( $post ) {

		// $post must be set
		if ( null != $post ) {

			// Use the correct URL path
			$url = parse_url( get_permalink( $post->ID ) );
			$url = $url['path'];

			// Output the hidden field
			echo '<input type="hidden" name="wpseo_old_url" value="' . esc_attr( $url ) . '"/>';

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

		if ( !isset( $_POST['wpseo_old_url'] ) ) {
			return;
		}

		// Get the new URL
		$new_url = parse_url( get_permalink( $post_id ) );
		$new_url = $new_url['path'];

		// Get the old URL
		$old_url = esc_url( $_POST['wpseo_old_url'] );

		// Get the site URL
		$site = parse_url( get_site_url() );

		// Check if we should create a redirect
		if ( in_array( $post->post_status, array(
				'publish',
				'static'
			) ) && $old_url != $new_url && $old_url != '/' && ( !isset( $site['path'] ) || ( isset( $site['path'] ) && $old_url != $site['path'] . '/' ) )
		) {

			// The URL redirect manager
			$redirect_manager = new WPSEO_URL_Redirect_Manager();

			// Create the redirect
			$redirect_manager->create_redirect( $old_url, $new_url, 301 );

			// Format the message
			$message = sprintf( __( "WordPress SEO Premium created a <a href='%s'>redirect</a> from the old post URL to the new post URL. <a href='%s'>Click here to undo this</a>.", 'wordpress-seo' ), admin_url( 'admin.php?page=wpseo_redirects&s=' . urlencode( $old_url ) ), 'javascript:wpseo_undo_redirect("' . urlencode( $old_url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '");' );

			// Add the message to the notifications center
			Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $message ) );

		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get trashed
	 *
	 * @param $post_id
	 */
	public function detect_post_trash( $post_id ) {

		// Get the post
		$post = get_post( $post_id );

		// No revisions please
		if ( $post->post_status != 'inherit' ) {
			// Get the right URL
			$url = parse_url( get_permalink( $post_id ) );
			$url = $url['path'];

			// If $url is not a single /, there may be the option to create a redirect
			if ( $url !== '/' ) {
				// Message should only be shown if there isn't already a redirect
				if ( ! $this->check_if_redirect_exists( $url ) ) {
					// Format the message
					$message = sprintf( __( "WordPress SEO Premium detected that you moved a post to the trash. <a href='%s'>Click here to create a redirect from the old post URL</a>.", 'wordpress-seo' ), 'javascript:wpseo_create_redirect("' . urlencode( $url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '");' );

					// Add the message to the notifications center
					Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $message ) );
				}
			}
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get  restored from the trash
	 *
	 * @param $post_id
	 */
	public function detect_post_untrash( $post_id ) {

		// Get the post
		$post = get_post( $post_id );

		// No revisions please
		if ( $post->post_status != 'inherit' ) {
			// Get the right URL
			$url = parse_url( get_permalink( $post_id ) );
			$url = $url['path'];

			// If $url is not a single /, there may be the option to create a redirect
			if ( $url !== '/' ) {
				// Message should only be shown if there's already a redirect
				if ( $this->check_if_redirect_exists( $url ) ) {
					// Format the message
					$message = sprintf( __( "WordPress SEO Premium detected that you restored a post from the trash. <a href='%s'>Click here to remove the redirect</a>.", 'wordpress-seo' ), 'javascript:wpseo_undo_redirect("' . urlencode( $url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '");' );

					// Add the message to the notifications center
					Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $message ) );
				}
			}
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get deleted
	 *
	 * @param $post_id
	 */
	public function detect_post_delete( $post_id ) {

		// Get the post
		$post = get_post( $post_id );

		// No revisions please
		if ( $post->post_status != 'inherit' ) {
			// Get the right URL
			$url = parse_url( get_permalink( $post_id ) );
			$url = $url['path'];

			// If $url is not a single /, there may be the option to create a redirect
			if ( $url !== '/' ) {
				// Message should only be shown if there isn't already a redirect
				if ( !$this->check_if_redirect_exists( $url ) ) {
					// Format the message
					$message = sprintf( __( "WordPress SEO Premium detected that you deleted a post. <a href='%s'>Click here to create a redirect from the old post URL</a>.", 'wordpress-seo' ), 'javascript:wpseo_create_redirect("' . urlencode( $url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '");' );

					// Add the message to the notifications center
					Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $message ) );
				}
			}
		}

	}

	/**
	 * Look up if url does exists in the current redirects
	 *
	 * @param string $url url to search for
	 *
	 * @return bool
	 */
	public function check_if_redirect_exists( $url ) {
		$redirect_manager = new WPSEO_URL_Redirect_Manager();
		$redirects        = $redirect_manager->get_redirects();

		return array_key_exists( $url, $redirects );
	}

}