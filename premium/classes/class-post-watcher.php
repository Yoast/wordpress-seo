<?php

class WPSEO_Post_Watcher extends WPSEO_Watcher {

	/**
	 * Type of watcher.
	 *
	 * This will be used for the filters.
	 *
	 * @var string
	 */
	protected $watch_type = 'post';

	/**
	 * Add an extra field to post edit screen so we know the old url in the 'post_updated' hook
	 *
	 * @param $post
	 */
	public function old_url_field( $post ) {
		// $post must be set
		if ( null != $post ) {
			$url = $this->get_target_url( $post->ID );

			echo $this->parse_url_field( $url );
		}
	}


	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param integer $post_id
	 * @param $post
	 * @param $post_before
	 */
	public function detect_slug_change( $post_id, $post, $post_before ) {

		if ( !isset( $_POST['wpseo_old_url'] ) ) {
			return;
		}

		// Get the new URL
		$new_url = $this->get_target_url( $post_id );

		// Get the old URL
		$old_url = esc_url( $_POST['wpseo_old_url'] );

		// Check if we should create a redirect
		if ( in_array( $post->post_status, array( 'publish', 'static' ) ) && $this->should_create_redirect( $old_url, $new_url ) ) {
			// Format the message
			$message = sprintf( __( "WordPress SEO Premium created a <a href='%s'>redirect</a> from the old post URL to the new post URL. <a href='%s'>Click here to undo this</a>.", 'wordpress-seo' ), $this->admin_redirect_url( $old_url ), $this->javascript_undo_redirect( $old_url ) );

			$this->create_redirect( $old_url, $new_url );

			$this->create_notification( $message, 'slug_change' );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get trashed
	 *
	 * @param $post_id
	 */
	public function detect_post_trash( $post_id ) {

		if( $url = $this->check_if_redirect_needed( $post_id )) {

			// Format the message
			$message = sprintf( __( "WordPress SEO Premium detected that you moved a post to the trash. <a href='%s'>Click here to create a redirect from the old post URL</a>.", 'wordpress-seo' ), $this->javascript_create_redirect( $url ) );

			$this->create_notification( $message, 'trash' );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get  restored from the trash
	 *
	 * @param $post_id
	 */
	public function detect_post_untrash( $post_id ) {

		if( $url = $this->check_if_redirect_needed( $post_id )) {

			// Format the message
			$message = sprintf( __( "WordPress SEO Premium detected that you restored a post from the trash. <a href='%s'>Click here to remove the redirect</a>.", 'wordpress-seo' ), $this->javascript_undo_redirect( $url ) );

			$this->create_notification( $message, 'untrash' );
		}

	}

	/**
	 * Offer to create a redirect from the post that is about to get deleted
	 *
	 * @param $post_id
	 */
	public function detect_post_delete( $post_id ) {

		// Is a redirect needed
		if( $url = $this->check_if_redirect_needed( $post_id )) {

			// Format the message
			$message = sprintf( __( "WordPress SEO Premium detected that you deleted a post. <a href='%s'>Click here to create a redirect from the old post URL</a>.", 'wordpress-seo' ), $this->javascript_create_redirect( $url ) );

			$this->create_notification( $message, 'delete' );
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


	/**
	 * This method checks if a redirect is needed.
	 *
	 * This method will check if url as redirect already exists
	 *
	 * @param integer $post_id
	 *
	 * @return mixed
	 */
	protected function check_if_redirect_needed( $post_id ) {

		// Get the post
		$post = get_post( $post_id );

		// No revisions please
		if ( $post->post_status != 'inherit' ) {
			// Get the right URL
			$url = $this->get_target_url( $post_id );

			// If $url is not a single /, there may be the option to create a redirect
			if ( $url !== '/' ) {
				// Message should only be shown if there isn't already a redirect
				if ( ! $this->check_if_redirect_exists( $url ) ) {
					return $url;
				}
			}
		}

	}

	/**
	 * Get the URL to the post and returns it's path
	 *
	 * @param integer $post_id
	 *
	 * @return string
	 */
	protected function get_target_url( $post_id ) {
		// Use the correct URL path
		$url = parse_url( get_permalink( $post_id ) );
		$url = $url['path'];

		return $url;
	}

}