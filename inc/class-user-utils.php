<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Inc
 */

/**
 * Represents the post type utils.
 */
class WPSEO_User_Utils {

	/**
	 * Checks whether a user has public posts.
	 *
	 * @param string $user_id The user ID.
	 *
	 * @return bool Whether the user has public posts.
	 */
	public function user_has_posts( $user_id ) {
		$user_post_count = (int) count_user_posts( $user_id, array( 'post' ), true );

		return $user_post_count > 0;
	}
}
