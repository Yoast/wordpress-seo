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
		add_action( 'wp_unique_post_slug', array( $this, 'hook_unique_post_slug' ), 10, 6 );
	}

	/**
	 * Generate an unique slug if it is necessary. This might be the case when given slug is redirected.
	 *
	 * @param string $slug          The slug that have to be unique.
	 * @param int    $post_ID       Post ID.
	 * @param string $post_status   The post status.
	 * @param string $post_type     Post type.
	 * @param int    $post_parent   Post parent ID.
	 * @param string $original_slug The original post slug.
	 *
	 * @return string Unique slug for the post, based on $post_name (with a -1, -2, etc. suffix)
	 */
	public function hook_unique_post_slug( $slug, $post_ID, $post_status, $post_type, $post_parent, $original_slug ) {
		if ( $this->check_for_redirect( $slug ) ) {
			$suffix = $this->get_suffix( $slug, $original_slug );
			$slug   = $original_slug . '-' . $suffix;
			$slug   = wp_unique_post_slug( $slug, $post_ID, $post_status, $post_type, $post_parent );
		}

		return $slug;
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

	/**
	 * Get the new suffix.
	 *
	 * @param string $slug          The new slug.
	 * @param string $original_slug The original slug.
	 *
	 * @return integer
	 */
	protected function get_suffix( $slug, $original_slug ) {
		if ( $slug === $original_slug ) {
			return 2;
		}

		return ( str_replace( $original_slug . '-', '', $slug ) + 1 );
	}

}
