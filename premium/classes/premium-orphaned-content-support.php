<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium
 */

/**
 * Represents the functionality for the orphaned content support.
 */
class WPSEO_Premium_Orphaned_Content_Support {

	/**
	 * Returns an array with the supported post types.
	 *
	 * @return array The supported post types.
	 */
	public function get_supported_post_types() {
		/**
		 * Filter: 'wpseo_orphaned_post_types' - Allows changes for the accessible post types.
		 *
		 * @api array The accessible post types.
		 */
		$orphaned_post_types = apply_filters( 'wpseo_orphaned_post_types', WPSEO_Post_Type::get_accessible_post_types() );
		if ( ! is_array( $orphaned_post_types ) || empty( $orphaned_post_types ) ) {
			$orphaned_post_types = array();
		}

		return $orphaned_post_types;
	}

	/**
	 * Checks if the post type is supported.
	 *
	 * @param string $post_type The post type to look up.
	 *
	 * @return bool True when post type is supported.
	 */
	public function is_post_type_supported( $post_type ) {
		return in_array( $post_type, $this->get_supported_post_types(), true );
	}
}
