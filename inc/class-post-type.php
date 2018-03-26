<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Inc
 */

/**
 * Represents the post type utils.
 */
class WPSEO_Post_Type {

	/**
	 * Returns an array with the accessible post types.
	 *
	 * An accessible post type is a post type that is public and isn't set as no-index (robots).
	 *
	 * @return array Array with all the accessible post_types.
	 */
	public static function get_accessible_post_types() {
		$post_types = get_post_types( array( 'public' => true ) );

		/**
		 * Filter: 'wpseo_accessible_post_types' - Allow changing the accessible post types.
		 *
		 * @api array $post_types The public post types.
		 */
		$post_types = apply_filters( 'wpseo_accessible_post_types', $post_types );

		// When the array gets messed up somewhere.
		if ( ! is_array( $post_types ) ) {
			return array();
		}

		return $post_types;
	}

	/**
	 * Returns whether the passed post type is considered accessible.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool Whether or not the post type is considered accessible.
	 */
	public static function is_post_type_accessible( $post_type ) {
		return in_array( $post_type, self::get_accessible_post_types(), true );
	}

	/**
	 * Checks if the request post type is public and indexable.
	 *
	 * @param string $post_type_name The name of the post type to lookup.
	 *
	 * @return bool True when post type is set to index.
	 */
	public static function is_post_type_indexable( $post_type_name ) {
		if ( WPSEO_Options::get( 'disable-' . $post_type_name, false ) ) {
			return false;
		}

		return ( false === WPSEO_Options::get( 'noindex-' . $post_type_name, false ) );
	}

	/**
	 * Filters the attachment post type from an array with post_types.
	 *
	 * @param array $post_types The array to filter the attachment post type from.
	 *
	 * @return array The filtered array.
	 */
	public static function filter_attachment_post_type( array $post_types ) {
		unset( $post_types['attachment'] );

		return $post_types;
	}

	/**
	 * Checks if the post type is enabled in the REST API.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool Whether or not the post type is available in the REST API.
	 */
	public static function is_rest_enabled( $post_type ) {
		$post_type_object = get_post_type_object( $post_type );

		if ( is_null( $post_type_object ) ) {
			return false;
		}

		return $post_type_object->show_in_rest === true;
	}
}
