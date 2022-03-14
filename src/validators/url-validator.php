<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Url_Exception;

/**
 * The URL validator class.
 */
class Url_Validator extends String_Validator {

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value is a URL.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Url_Exception When the value is an invalid URL.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception When the value is not a string.
	 *
	 * @return mixed A valid URL.
	 */
	public function validate( $value, array $settings = null ) {
		$url = parent::validate( $value );

		$url = \trim( \htmlspecialchars( $url, ENT_COMPAT, $this->get_charset(), true ) );
		$url = $this->sanitize( $url );

		$url = \filter_var( $url, FILTER_VALIDATE_URL );
		if ( ! $url ) {
			throw new Invalid_Url_Exception( $value );
		}

		return $url;
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber

	/**
	 * Sanitize an url for saving to the database.
	 * Not to be confused with the old native WP function.
	 *
	 * @param string $value             String URL value to sanitize.
	 * @param array  $allowed_protocols Optional set of allowed protocols.
	 *
	 * @return string
	 */
	public function sanitize( $value, $allowed_protocols = [ 'http', 'https' ] ) {
		$url   = '';
		$parts = \wp_parse_url( $value );

		if ( isset( $parts['scheme'], $parts['host'] ) ) {
			$url = $parts['scheme'] . '://';

			if ( isset( $parts['user'] ) ) {
				$url .= \rawurlencode( $parts['user'] );
				$url .= isset( $parts['pass'] ) ? ':' . \rawurlencode( $parts['pass'] ) : '';
				$url .= '@';
			}

			$parts['host'] = \preg_replace(
				'`[^a-z0-9-.:\[\]\\x80-\\xff]`',
				'',
				\strtolower( $parts['host'] )
			);

			$url .= $parts['host'] . ( isset( $parts['port'] ) ? ':' . \intval( $parts['port'] ) : '' );
		}

		if ( isset( $parts['path'] ) && \strpos( $parts['path'], '/' ) === 0 ) {
			$path = \explode( '/', \wp_strip_all_tags( $parts['path'] ) );
			$path = $this->sanitize_encoded_text_field( $path );
			$url .= \implode( '/', $path );
		}

		if ( ! $url ) {
			return '';
		}

		if ( isset( $parts['query'] ) ) {
			/*
			 * Note: this used to be `wp_parse_str`.
			 * Changed to the non WP version due to Brain Monkey stubs not handling the passing by reference.
			 *
			 * To adhere to the WP version, the filter done in there is done here.
			 */
			\parse_str( $parts['query'], $parsed_query );
			$parsed_query = \apply_filters( 'wp_parse_str', $parsed_query );

			$parsed_query = \array_combine(
				$this->sanitize_encoded_text_field( \array_keys( $parsed_query ) ),
				$this->sanitize_encoded_text_field( \array_values( $parsed_query ) )
			);

			$url = \add_query_arg( $parsed_query, $url );
		}

		if ( isset( $parts['fragment'] ) ) {
			$url .= '#' . $this->sanitize_encoded_text_field( $parts['fragment'] );
		}

		if ( \strpos( $url, '%' ) !== false ) {
			$url = \preg_replace_callback(
				'`%[a-fA-F0-9]{2}`',
				static function ( $octects ) {
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

	/**
	 * Retrieves the site's charset. Defaults to UTF-8.
	 *
	 * @return string
	 */
	protected function get_charset() {
		return \get_bloginfo( 'charset' );
	}
}
