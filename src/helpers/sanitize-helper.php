<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for sanitizing values.
 */
class Sanitize_Helper {

	/**
	 * Emulate the WP native sanitize_text_field function in a %%variable%% safe way.
	 *
	 * @link https://core.trac.wordpress.org/browser/trunk/src/wp-includes/formatting.php for the original.
	 *
	 * Sanitize a string from user input or from the db.
	 *
	 * - Check for invalid UTF-8;
	 * - Convert single < characters to entity;
	 * - Strip all tags;
	 * - Remove line breaks, tabs and extra white space;
	 * - Strip octets - BUT DO NOT REMOVE (part of) VARIABLES WHICH WILL BE REPLACED.
	 *
	 * @since 1.8.0
	 *
	 * @param string $value String value to sanitize.
	 *
	 * @return string
	 */
	public function sanitize_text_field( $value ) {
		$filtered = \wp_check_invalid_utf8( $value );

		if ( strpos( $filtered, '<' ) !== false ) {
			$filtered = \wp_pre_kses_less_than( $filtered );
			// This will strip extra whitespace for us.
			$filtered = \wp_strip_all_tags( $filtered, true );
		}
		else {
			$filtered = \trim( \preg_replace( '`[\r\n\t ]+`', ' ', $filtered ) );
		}

		$found = false;
		while ( \preg_match( '`[^%](%[a-f0-9]{2})`i', $filtered, $match ) ) {
			$filtered = \str_replace( $match[1], '', $filtered );
			$found    = true;
		}
		unset( $match );

		if ( $found ) {
			// Strip out the whitespace that may now exist after removing the octets.
			$filtered = \trim( \preg_replace( '` +`', ' ', $filtered ) );
		}

		/**
		 * Filter a sanitized text field string.
		 *
		 * @since WP 2.9.0
		 *
		 * @param string $filtered The sanitized string.
		 * @param string $str      The string prior to being sanitized.
		 */
		return \apply_filters( 'sanitize_text_field', $filtered, $value ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- Using WP native filter.
	}

	/**
	 * Sanitize a url for saving to the database.
	 * Not to be confused with the old native WP function.
	 *
	 * @since 1.8.0
	 *
	 * @param string $value             String URL value to sanitize.
	 * @param array  $allowed_protocols Optional set of allowed protocols.
	 *
	 * @return string
	 */
	public function sanitize_url( $value, $allowed_protocols = [ 'http', 'https' ] ) {
		$url   = '';
		$parts = wp_parse_url( $value );

		if ( isset( $parts['scheme'], $parts['host'] ) ) {
			$url = $parts['scheme'] . '://';

			if ( isset( $parts['user'] ) ) {
				$url .= rawurlencode( $parts['user'] );
				$url .= isset( $parts['pass'] ) ? ':' . rawurlencode( $parts['pass'] ) : '';
				$url .= '@';
			}

			$parts['host'] = preg_replace(
				'`[^a-z0-9-.:\[\]\\x80-\\xff]`',
				'',
				strtolower( $parts['host'] )
			);

			$url .= $parts['host'] . ( isset( $parts['port'] ) ? ':' . intval( $parts['port'] ) : '' );
		}

		if ( isset( $parts['path'] ) && strpos( $parts['path'], '/' ) === 0 ) {
			$path = explode( '/', wp_strip_all_tags( $parts['path'] ) );
			$path = $this->sanitize_encoded_text_field( $path );
			$url .= implode( '/', $path );
		}

		if ( ! $url ) {
			return '';
		}

		if ( isset( $parts['query'] ) ) {
			wp_parse_str( $parts['query'], $parsed_query );

			$parsed_query = array_combine(
				$this->sanitize_encoded_text_field( array_keys( $parsed_query ) ),
				$this->sanitize_encoded_text_field( array_values( $parsed_query ) )
			);

			$url = add_query_arg( $parsed_query, $url );
		}

		if ( isset( $parts['fragment'] ) ) {
			$url .= '#' . $this->sanitize_encoded_text_field( $parts['fragment'] );
		}

		if ( \strpos( $url, '%' ) !== false ) {
			$url = \preg_replace_callback(
				'`%[a-fA-F0-9]{2}`',
				function( $octects ) {
					return \strtolower( $octects[0] );
				},
				$url
			);
		}

		return \esc_url_raw( $url, $allowed_protocols );
	}

	/**
	 * Decode, sanitize and encode the array of strings or the string.
	 *
	 * @since 13.3
	 *
	 * @param array|string $value The value to sanitize and encode.
	 *
	 * @return array|string The sanitized value.
	 */
	public function sanitize_encoded_text_field( $value ) {
		if ( \is_array( $value ) ) {
			return \array_map( [ $this, 'sanitize_encoded_text_field' ], $value );
		}

		return \rawurlencode( \sanitize_text_field( \rawurldecode( $value ) ) );
	}

}
