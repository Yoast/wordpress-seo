<?php

class WPSEO_Slug_Change_Watcher implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {

		// When plugin is premium, just do nothing.
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return;
		}

		// Detect a post slug change.
		add_action( 'post_updated', array( $this, 'detect_slug_change' ), 12, 3 );
	}

	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param integer $post_id     The ID of the post. Unused.
	 * @param WP_Post $post        The post with the new values.
	 * @param WP_Post $post_before The post with the previous values.
	 *
	 * @return void
	 */
	public function detect_slug_change( $post_id, $post, $post_before ) {
		// If post is a revision do not create redirect.
		if ( wp_is_post_revision( $post_before ) && wp_is_post_revision( $post ) ) {
			return;
		}

		// There is no slug change.
		if ( $post->post_name === $post_before->post_name ) {
			return;
		}

		// If the post URL wasn't public before, or isn't public now, don't even check if we have to redirect.
		if ( ! $this->check_public_post_status( get_post_status( $post_before->ID ) ) || ! $this->check_public_post_status( get_post_status( $post->ID ) ) ) {
			return;
		}

		add_action( 'admin_notices', array( $this, 'show_notice' ) );
	}


	public function show_notice() {
		$class = 'notice notice-error';
		$message = __( 'Irks! An error has occurred.', 'sample-text-domain' );

		printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) );
	}

	/**
	 * Checks whether the given post status is public or not
	 *
	 * @param string $post_status The post status to check.
	 *
	 * @return bool
	 */
	protected function check_public_post_status( $post_status ) {
		$public_post_statuses = array(
			'publish',
			'static',
			'private',
		);

		return in_array( $post_status, $public_post_statuses, true );
	}
}
