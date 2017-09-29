<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the yoast cornerstone content.
 */
class WPSEO_Cornerstone {

	const META_NAME = '_yst_is_cornerstone';

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'save_post', array( $this, 'save_meta_value' ) );
	}

	/**
	 * Saves the meta value to the database.
	 *
	 * @param int $post_id The post id to save the meta value for.
	 */
	public function save_meta_value( $post_id ) {
		$is_cornerstone = ( filter_input( INPUT_POST, self::META_NAME ) === '1' );

		if ( $is_cornerstone ) {
			update_post_meta( $post_id, self::META_NAME, $is_cornerstone );

			return;
		}

		delete_post_meta( $post_id, self::META_NAME );
	}
}
