<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the yoast cornerstone content.
 */
class WPSEO_Cornerstone {

	const META_NAME = 'is_cornerstone';

	const FIELD_NAME = 'yoast_wpseo_is_cornerstone';

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		global $pagenow;

		if ( ! $this->page_contains_cornerstone_content_field( $pagenow ) ) {
			return;
		}

		add_action( 'save_post', array( $this, 'save_meta_value' ) );
		add_filter( 'wpseo_cornerstone_post_types', array( 'WPSEO_Post_Type', 'filter_attachment_post_type' ) );
	}

	/**
	 * Saves the meta value to the database.
	 *
	 * @param int $post_id The post id to save the meta value for.
	 *
	 * @return void
	 */
	public function save_meta_value( $post_id ) {
		$is_cornerstone_content = $this->is_cornerstone_content();

		if ( $is_cornerstone_content ) {
			$this->update_meta( $post_id, $is_cornerstone_content );

			return;
		}

		$this->delete_meta( $post_id );
	}

	/**
	 * Returns the result of the cornerstone content checkbox.
	 *
	 * @return bool True when checkbox is checked.
	 */
	protected function is_cornerstone_content() {
		return filter_input( INPUT_POST, self::FIELD_NAME ) === 'true';
	}

	/**
	 * Checks if the current page matches one of the pages that contains the cornerstone content field.
	 *
	 * @param string $page The page to check.
	 *
	 * @return bool True when the page contains the cornerstone content field.
	 */
	protected function page_contains_cornerstone_content_field( $page ) {
		return WPSEO_Metabox::is_post_edit( $page );
	}

	/**
	 * Updates the cornerstone content post meta with the given cornerstone content value.
	 *
	 * @param int  $post_id                The post id to save the meta value for.
	 * @param bool $is_cornerstone_content Whether or not the post should be considered to be cornerstone content.
	 *
	 * @return void
	 */
	protected function update_meta( $post_id, $is_cornerstone_content ) {
		WPSEO_Meta::set_value( self::META_NAME, $is_cornerstone_content, $post_id );
	}

	/**
	 * Deletes the cornerstone content post meta for the given post id.
	 *
	 * @param int $post_id The post id to delete the cornerstone content meta value for..
	 *
	 * @return void
	 */
	protected function delete_meta( $post_id ) {
		WPSEO_Meta::delete( self::META_NAME, $post_id );
	}
}
