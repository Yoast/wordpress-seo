<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for string operations.
 */
class String_Helper {

	/**
	 * Strips all HTML tags including script and style.
	 *
	 * @param string $string The string to strip the tags from.
	 *
	 * @return string The processed string.
	 */
	public function strip_all_tags( $string ) {
		return \wp_strip_all_tags( $string );
	}

	/**
	 * Standardize whitespace in a string.
	 *
	 * Replace line breaks, carriage returns, tabs with a space, then remove double spaces.
	 *
	 * @param string $string String input to standardize.
	 *
	 * @return string
	 */
	public function standardize_whitespace( $string ) {
		return \trim( \str_replace( '  ', ' ', \str_replace( [ "\t", "\n", "\r", "\f" ], ' ', $string ) ) );
	}

	/**
	 * First strip out registered and enclosing shortcodes using native WordPress strip_shortcodes function.
	 * Then strip out the shortcodes with a filthy regex, because people don't properly register their shortcodes.
	 *
	 * @param string $text Input string that might contain shortcodes.
	 *
	 * @return string $text String without shortcodes.
	 */
	public function strip_shortcode( $text ) {
		return \preg_replace( '`\[[^\]]+\]`s', '', \strip_shortcodes( $text ) );
	}
}
