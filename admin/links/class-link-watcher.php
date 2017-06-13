<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link watcher. This class will watch for the save_post hook being called.
 */
class WPSEO_Link_Watcher {

	/**
	 * Registers the hooks
	 */
	public function register_hooks() {
		add_action( 'save_post', array( $this, 'save_post' ), 10, 2 );
	}

	/**
	 * Saves the links that are used in the post.
	 *
	 * @param int     $post_id The post id to.
	 * @param WP_Post $post    The post object.
	 */
	public function save_post( $post_id, WP_Post $post ) {
		$content = $post->post_content;
		$content = apply_filters( 'the_content', $content );
		$content = str_replace( ']]>', ']]&gt;', $content );

		if ( empty( $content ) ) {
			return;
		}

		$processor = new WPSEO_Link_Content_Processor();
		$processor->process( $post_id, $content );
	}
}
