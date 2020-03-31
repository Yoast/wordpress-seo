<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Schema utility functions.
 *
 * @deprecated 14.0
 *
 * @since 11.6
 */
class WPSEO_Schema_Utils {

	/**
	 * Retrieves a user's Schema ID.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param int                  $user_id The ID of the User you need a Schema ID for.
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 *
	 * @return string The user's schema ID.
	 */
	public static function get_user_schema_id( $user_id, $context ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->id->get_user_schema_id' );
		return YoastSEO()->helpers->schema->id->get_user_schema_id( $user_id, $context );
	}

	/**
	 * Retrieves the post title with fallback to `No title`.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param int $post_id Optional. Post ID.
	 *
	 * @return string The post title with fallback to `No title`.
	 */
	public static function get_post_title_with_fallback( $post_id = 0 ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', ' YoastSEO()->helpers->post->get_post_title_with_fallback' );
		return YoastSEO()->helpers->post->get_post_title_with_fallback( $post_id );
	}

	/**
	 * Adds the `inLanguage` property to a Schema piece.
	 *
	 * Must use one of the language codes from the IETF BCP 47 standard. The
	 * language tag syntax is made of one or more subtags separated by a hyphen
	 * e.g. "en", "en-US", "zh-Hant-CN".
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array $data The Schema piece data.
	 *
	 * @return array The Schema piece data with added language property.
	 */
	public static function add_piece_language( $data ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->language->add_piece_language' );
		return YoastSEO()->helpers->schema->language->add_piece_language( $data );
	}
}
