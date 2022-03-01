<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;

/**
 * The text field validator class.
 *
 * Note: the value of a text field is expected to be single line.
 */
class Text_Field_Validator extends String_Validator {

	/**
	 * Validates if a value is a single line text.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Type_Exception When the type of the value is not a string.
	 *
	 * @return string A valid text.
	 */
	public function validate( $value, array $settings = null ) {
		$string = parent::validate( $value, $settings );

		return $this->sanitize( $string );
	}

	/**
	 * Emulates the WP native sanitize_text_field function in a %%variable%% safe way.
	 *
	 * Sanitize a string from user input or from the db.
	 *
	 * - Check for invalid UTF-8;
	 * - Convert single < characters to entity;
	 * - Strip all tags;
	 * - Remove line breaks, tabs and extra white space;
	 * - Strip octets - BUT DO NOT REMOVE (part of) VARIABLES WHICH WILL BE REPLACED.
	 *
	 * @link https://core.trac.wordpress.org/browser/trunk/src/wp-includes/formatting.php for the original.
	 *
	 * @param string $value String value to sanitize.
	 *
	 * @return string Sanitized string.
	 */
	protected function sanitize( $value ) {
		$filtered = \wp_check_invalid_utf8( $value );

		if ( \strpos( $filtered, '<' ) !== false ) {
			$filtered = \wp_pre_kses_less_than( $filtered );
			// This will strip extra whitespace for us.
			$filtered = \wp_strip_all_tags( $filtered, true );

			// Use HTML entities in a special case to make sure no later
			// newline stripping stage could lead to a functional tag.
			$filtered = \str_replace( "<\n", "&lt;\n", $filtered );
		}

		$filtered = \trim( \preg_replace( '/[\r\n\t ]+/', ' ', $filtered ) );

		$found = false;
		while ( \preg_match( '/[^%](%[a-f0-9]{2})/i', $filtered, $match ) ) {
			$filtered = \str_replace( $match[1], '', $filtered );
			$found    = true;
		}
		unset( $match );

		if ( $found ) {
			// Strip out the whitespace that may now exist after removing the octets.
			$filtered = \trim( \preg_replace( '/ +/', ' ', $filtered ) );
		}

		/**
		 * Filters a sanitized text field string.
		 *
		 * @param string $filtered The sanitized string.
		 * @param string $value    The string prior to being sanitized.
		 *
		 * @since WP 2.9.0
		 */
		return \apply_filters( 'sanitize_text_field', $filtered, $value ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- Using WP native filter.
	}
}
