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
		add_action( 'post_submitbox_misc_actions', array( $this, 'add_checkbox' ) );
		add_action( 'save_post', array( $this, 'save_meta_value' ) );
	}

	/**
	 * Shows a div with a checkbox in it. Make it possible to mark the page as cornerstone content.
	 *
	 * @param WP_POST $post The post object.
	 */
	public function add_checkbox( $post ) {
		$checked = checked( $this->get_meta_value( $post->ID ), '1', false );

		echo '<div class="misc-pub-section yoast" id="yoast-cornerstone-content">';
		echo '<label>';
		echo '<input type="checkbox" value="1" name="' . WPSEO_Cornerstone::META_NAME . '" ' . $checked . ' /> ';
		echo ' ' . __( 'Cornerstone content', 'wordpress-seo' );
		echo '<label>';
		echo '</div>';
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

	/**
	 * Gets the meta value from the database.
	 *
	 * @param int $post_id The post id to get the meta value for.
	 *
	 * @return null|string The meta value from the database.
	 */
	protected function get_meta_value( $post_id ) {
		return get_post_meta( $post_id, WPSEO_Cornerstone::META_NAME, true );
	}
}
