<?php
/**
 * A helper object for the user.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

/**
 * Class User_Helper
 */
class User_Helper {

	/**
	 * Retrieves user meta field for a user.
	 *
	 * @param int    $user_id User ID.
	 * @param string $key     Optional. The meta key to retrieve. By default, returns data for all keys.
	 * @param bool   $single  Whether to return a single value.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return mixed Will be an array if $single is false. Will be value of meta data field if $single is true.
	 */
	public function get_meta( $user_id, $key = '', $single = false ) {
		return \get_user_meta( $user_id, $key, $single );
	}

	/**
	 * Counts the number of posts the user has written in this post type.
	 *
	 * @param int          $user_id   User ID.
	 * @param array|string $post_type Optional. Single post type or array of post types to count the number of posts
	 *                                for. Default 'post'.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return int The number of posts the user has written in this post type.
	 */
	public function count_posts( $user_id, $post_type = 'post' ) {
		return (int) \count_user_posts( $user_id, $post_type, true );
	}

	/**
	 * Retrieves the requested data of the author.
	 *
	 * @param string    $field   The user field to retrieve.
	 * @param int|false $user_id User ID.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return string The author's field from the current author's DB object.
	 */
	public function get_the_author_meta( $field, $user_id ) {
		return \get_the_author_meta( $field, $user_id );
	}
}
