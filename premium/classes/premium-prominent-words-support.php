<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Represents the functionality for the prominent words support.
 */
class WPSEO_Premium_Prominent_Words_Support {

	/**
	 * Returns an array with the supported post types.
	 *
	 * @return array The supported post types.
	 */
	public function get_supported_post_types() {
		$rest_enabled_post_types = array_filter( WPSEO_Post_Type::get_accessible_post_types(), array( $this, 'is_rest_enabled' ) );

		/**
		 * Filter: 'wpseo_prominent_words_post_types' - Allows changes for the accessible post types.
		 *
		 * @api array The accessible post types.
		 */
		$prominent_words_post_types = apply_filters( 'wpseo_prominent_words_post_types', $rest_enabled_post_types );

		if ( ! is_array( $prominent_words_post_types ) || empty( $prominent_words_post_types ) ) {
			$prominent_words_post_types = array();
		}

		return $prominent_words_post_types;
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

	/**
	 * Checks if the post type is enabled in the REST API.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool Whether or not the post type is available in the REST API.
	 */
	public function is_rest_enabled( $post_type ) {
		$post_type_object = get_post_type_object( $post_type );

		return $post_type_object->show_in_rest === true;
	}
}
