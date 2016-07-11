<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * The watcher to fetch changes in the slug for the post.
 */
class WPSEO_Post_Slug_Watcher {

	/**
	 * Setting the hooks
	 */
	public function __construct() {
		add_action( 'draft_to_publish', array( $this, 'guarantee_unique_post_url' ) );
	}

	/**
	 * Changes the URL of a given post to make sure no redirect origin exists that is the same as the post.
	 *
	 * @param WP_Post $post The post to guarentee a unique URL for.
	 */
	public function guarantee_unique_post_url( $post ) {
		$slug = $this->remove_domain( get_permalink( $post ) );

		if ( $this->check_for_redirect( $slug ) ) {
			$unique_slug = $post->post_name . '-2';
			wp_update_post( array(
				'ID' => $post->ID,
				'post_name' => $unique_slug,
			) );
		}
	}

	/**
	 * Returns the slug part of a permalink.
	 *
	 * @param string $permalink A permalink with domain and slug.
	 * @return string The slug based on the permalink.
	 */
	private function remove_domain( $permalink ) {
		return str_replace( trailingslashit( home_url() ), '', $permalink );
	}

	/**
	 * Check if the slug already exists as a redirect.
	 *
	 * @param string $slug The slug to look for.
	 *
	 * @return bool
	 */
	protected function check_for_redirect( $slug ) {
		$redirect_manager = new WPSEO_Redirect_Manager();
		$redirect         = $redirect_manager->get_redirect( $slug );

		return $redirect instanceof WPSEO_Redirect;
	}
}
