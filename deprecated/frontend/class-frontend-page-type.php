<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Deprecated\Frontend
 */

/**
 * Represents the classifier for determine the type of the currently opened page.
 *
 * @deprecated 14.9
 * @codeCoverageIgnore
 */
class WPSEO_Frontend_Page_Type {

	/**
	 * Checks if the currently opened page is a simple page.
	 *
	 * @deprecated 14.9
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the currently opened page is a simple page.
	 */
	public static function is_simple_page() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9' );

		return false;
	}

	/**
	 * Returns the id of the currently opened page.
	 *
	 * @deprecated 14.9
	 * @codeCoverageIgnore
	 *
	 * @return int The id of the currently opened page.
	 */
	public static function get_simple_page_id() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9' );

		return 0;
	}

	/**
	 * Determine whether this is the homepage and shows posts.
	 *
	 * @deprecated 14.9
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not the current page is the homepage that displays posts.
	 */
	public static function is_home_posts_page() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9' );

		return false;
	}

	/**
	 * Determine whether this is the static frontpage.
	 *
	 * @deprecated 14.9
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not the current page is a static frontpage.
	 */
	public static function is_home_static_page() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9' );

		return false;
	}

	/**
	 * Determine whether this is the statically set posts page, when it's not the frontpage.
	 *
	 * @deprecated 14.9
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not it's a non-frontpage, statically set posts page.
	 */
	public static function is_posts_page() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9' );

		return false;
	}
}
