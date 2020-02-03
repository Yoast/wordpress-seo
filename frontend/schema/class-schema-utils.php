<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Schema utility functions.
 *
 * @since 11.6
 */
class WPSEO_Schema_Utils {

	/**
	 * Retrieves a user's Schema ID.
	 *
	 * @param int                  $user_id The ID of the User you need a Schema ID for.
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 *
	 * @return string The user's schema ID.
	 */
	public static function get_user_schema_id( $user_id, $context ) {
		$user = get_userdata( $user_id );

		if ( is_object( $user ) && isset( $user->user_login ) ) {
			return $context->site_url . WPSEO_Schema_IDs::PERSON_HASH . wp_hash( $user->user_login . $user_id );
		}
		return $context->site_url . WPSEO_Schema_IDs::PERSON_HASH;
	}

	/**
	 * Retrieves the post title with fallback to `No title`.
	 *
	 * @param int $post_id Optional. Post ID.
	 *
	 * @return string The post title with fallback to `No title`.
	 */
	public static function get_post_title_with_fallback( $post_id = 0 ) {
		$post_title = get_the_title( $post_id );
		$title      = ( $post_title ) ? $post_title : __( 'No title', 'wordpress-seo' );

		return $title;
	}

	/**
	 * Adds the `inLanguage` property to a Schema piece.
	 *
	 * Must use one of the language codes from the IETF BCP 47 standard. The
	 * language tag syntax is made of one or more subtags separated by a hyphen
	 * e.g. "en", "en-US", "zh-Hant-CN".
	 *
	 * @param array $data The Schema piece data.
	 *
	 * @return string The Schema piece language.
	 */
	public static function add_piece_language( $data ) {
		/**
		 * Filter: 'wpseo_schema_piece_language' - Allow changing the Schema piece language.
		 *
		 * @api string $type The Schema piece language.
		 */
		$data['inLanguage'] = apply_filters( 'wpseo_schema_piece_language', get_bloginfo( 'language' ), $data );

		return $data;
	}
}
