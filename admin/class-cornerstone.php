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
		global $pagenow;

		if ( ! $this->page_contains_cornerstone_field( $pagenow ) ) {
			return;
		}

		add_action( 'save_post', array( $this, 'save_meta_value' ) );
	}

	/**
	 * Saves the meta value to the database.
	 *
	 * @param int $post_id The post id to save the meta value for.
	 */
	public function save_meta_value( $post_id ) {
		$is_cornerstone = $this->is_cornerstone_checkbox();

		if ( $is_cornerstone ) {
			$this->update_meta( $post_id, $is_cornerstone );

			return;
		}

		$this->delete_meta( $post_id );
	}

	/**
	 * Returns the result of the cornerstone checkbox.
	 *
	 * @return bool True when checkbox is checked.
	 */
	protected function is_cornerstone_checkbox() {
		return filter_input( INPUT_POST, self::META_NAME ) === '1';
	}

	/**
	 * Checks if the current page matches one of the pages that contains the cornerstone content field.
	 *
	 * @param string $page The page to check.
	 *
	 * @return bool True when the page contains the cornerstone field.
	 */
	protected function page_contains_cornerstone_field( $page ) {
		return in_array( $page, array( 'post-new.php', 'post.php' ), true );
	}

	/**
	 * Updates the post meta with the given value.
	 *
	 * @param int  $post_id        The post id to save the meta value for.
	 * @param bool $is_cornerstone The value for the post meta.
	 *
	 * @return void
	 */
	protected function update_meta( $post_id, $is_cornerstone ) {
		update_post_meta( $post_id, self::META_NAME, $is_cornerstone );
	}

	/**
	 * Deletes the post meta for the given post id.
	 *
	 * @param int $post_id The post id to delete the meta value for.
	 *
	 * @return void
	 */
	protected function delete_meta( $post_id ) {
		delete_post_meta( $post_id, self::META_NAME );
	}
}
