<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Adds a checkbox to the publish box and handles the saving of it.
 */
class WPSEO_Cornerstone_Metabox {

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
		$is_cornerstone = ( filter_input( INPUT_POST, WPSEO_Cornerstone::META_NAME ) === '1' );

		update_post_meta( $post_id, WPSEO_Cornerstone::META_NAME, $is_cornerstone );
	}
}
