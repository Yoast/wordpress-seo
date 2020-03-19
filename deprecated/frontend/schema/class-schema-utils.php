<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;

/**
 * Schema utility functions.
 *
 * @deprecated xx.x
 *
 * @since 11.6
 */
class WPSEO_Schema_Utils {

	/**
	 * Retrieves a user's Schema ID.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param int                  $user_id The ID of the User you need a Schema ID for.
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 *
	 * @return string The user's schema ID.
	 */
	public static function get_user_schema_id( $user_id, $context ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Helpers\Schema\ID_Helper::get_user_schema_id' );

		/**
		 * It represents the ID_Helper.
		 *
		 * @var ID_Helper $id
		 */
		$id = YoastSEO()->classes->get( ID_Helper::class );

		 return $id->get_user_schema_id( $user_id, $context );
	}

	/**
	 * Retrieves the post title with fallback to `No title`.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param int $post_id Optional. Post ID.
	 *
	 * @return string The post title with fallback to `No title`.
	 */
	public static function get_post_title_with_fallback( $post_id = 0 ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', ' Yoast\WP\SEO\Helpers\Post_Helper::get_post_title_with_fallback' );

		/**
		 * Represents the Post_Helper.
		 *
		 * @var Post_Helper $post
		 */
		$post = YoastSEO()->classes->get( Post_Helper::class );

		return $post->get_post_title_with_fallback( $post_id );
	}

	/**
	 * Adds the `inLanguage` property to a Schema piece.
	 *
	 * Must use one of the language codes from the IETF BCP 47 standard. The
	 * language tag syntax is made of one or more subtags separated by a hyphen
	 * e.g. "en", "en-US", "zh-Hant-CN".
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param array $data The Schema piece data.
	 *
	 * @return array The Schema piece data with added language property.
	 */
	public static function add_piece_language( $data ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Helpers\Schema\Language_Helper::add_piece_language' );

		/**
		 * Represents the Language_Helper.
		 *
		 * @var Language_Helper $language
		 */
		$language = YoastSEO()->classes->get( Language_Helper::class );

		return $language->add_piece_language( $data );
	}
}
