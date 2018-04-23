<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents a single redirect
 */
class WPSEO_Redirect implements ArrayAccess {

	const PERMANENT   = 301;
	const FOUND       = 302;
	const TEMPORARY   = 307;
	const DELETED     = 410;
	const UNAVAILABLE = 451;

	const FORMAT_PLAIN = 'plain';
	const FORMAT_REGEX = 'regex';

	/**
	 * @var string
	 */
	protected $origin;

	/**
	 * @var string
	 */
	protected $target = '';

	/**
	 * @var int
	 */
	protected $type;

	/**
	 * @var string
	 */
	protected $format;

	/**
	 * @var string
	 */
	protected $validation_error;

	/**
	 * WPSEO_Redirect constructor.
	 *
	 * @param string $origin The origin of the redirect.
	 * @param string $target The target of the redirect.
	 * @param int    $type   The type of the redirect.
	 * @param string $format The format of the redirect.
	 */
	public function __construct( $origin, $target = '', $type = self::PERMANENT, $format = self::FORMAT_PLAIN ) {
		$this->origin = ( $format === self::FORMAT_PLAIN ) ? $this->sanitize_origin_url( $origin ) : $origin;
		$this->target = $this->sanitize_target_url( $target );
		$this->format = $format;
		$this->type   = (int) $type;
	}

	/**
	 * Returns the origin.
	 *
	 * @return string The set origin.
	 */
	public function get_origin() {
		return $this->origin;
	}

	/**
	 * Returns the target
	 *
	 * @return string The set target.
	 */
	public function get_target() {
		return $this->target;
	}

	/**
	 * Returns the type
	 *
	 * @return int The set type.
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * Returns the format
	 *
	 * @return string The set format.
	 */
	public function get_format() {
		return $this->format;
	}

	/**
	 * (PHP 5 &gt;= 5.0.0) - Whether a offset exists
	 *
	 * @link http://php.net/manual/en/arrayaccess.offsetexists.php
	 *
	 * @param string $offset An offset to check for.
	 *
	 * @return boolean true on success or false on failure.
	 *
	 * The return value will be casted to boolean if non-boolean was returned.
	 */
	public function offsetExists( $offset ) {
		return in_array( $offset, array( 'url', 'type' ), true );
	}

	/**
	 * (PHP 5 &gt;= 5.0.0) - Offset to retrieve
	 *
	 * @link http://php.net/manual/en/arrayaccess.offsetget.php
	 *
	 * @param string $offset The offset to retrieve.
	 *
	 * @return mixed Can return all value types.
	 */
	public function offsetGet( $offset ) {
		switch ( $offset ) {
			case 'old':
				return $this->origin;

			case 'url':
				return $this->target;

			case 'type':
				return $this->type;
		}

		return null;
	}

	/**
	 * (PHP 5 &gt;= 5.0.0) - Offset to set
	 *
	 * @link http://php.net/manual/en/arrayaccess.offsetset.php
	 *
	 * @param string $offset The offset to assign the value to.
	 * @param string $value  The value to set.
	 *
	 * @return void
	 */
	public function offsetSet( $offset, $value ) {
		switch ( $offset ) {
			case 'url':
				$this->target = $value;
				break;
			case 'type':
				$this->type = $value;
				break;
		}
	}

	/**
	 * (PHP 5 &gt;= 5.0.0) - Offset to unset
	 *
	 * @link http://php.net/manual/en/arrayaccess.offsetunset.php
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $offset The offset to unset.
	 *
	 * @return void
	 */
	public function offsetUnset( $offset ) {

	}

	/**
	 * Compares an URL with the origin of the redirect.
	 *
	 * @param string $url The URL to compare.
	 *
	 * @return bool True when url matches the origin.
	 */
	public function origin_is( $url ) {
		// Sanitize the slash in case of plain redirect.
		if ( $this->format === self::FORMAT_PLAIN ) {
			$url = $this->sanitize_slash( $url );
		}

		return (string) $this->origin === (string) $url;
	}

	/**
	 * Strip the trailing slashes for relative URLs.
	 *
	 * @param string $url_to_sanitize The URL to sanitize.
	 *
	 * @return string The sanitized url.
	 */
	private function sanitize_slash( $url_to_sanitize ) {
		$url = $url_to_sanitize;
		if ( $url !== '/' && WPSEO_Redirect_Util::is_relative_url( $url_to_sanitize ) ) {
			$url = trim( $url_to_sanitize, '/' );
		}

		return $url;
	}

	/**
	 * Strip the protocol from the URL.
	 *
	 * @param string $scheme The scheme to strip.
	 * @param string $url    The URL to remove the scheme from.
	 *
	 * @return string The url without the scheme.
	 */
	private function strip_scheme_from_url( $scheme, $url ) {
		return str_replace( $scheme . '://', '', $url );
	}

	/**
	 * Remove the home URL from the redirect to ensure that relative URLs are created.
	 *
	 * @param string $url The URL to sanitize.
	 *
	 * @return string The sanitized url.
	 */
	private function sanitize_origin_url( $url ) {
		$home_url        = get_home_url();
		$home_url_pieces = wp_parse_url( $home_url );
		$url_pieces      = wp_parse_url( $url );

		if ( $this->match_home_url( $home_url_pieces, $url_pieces ) ) {
			$url = str_replace(
				$this->strip_scheme_from_url( $home_url_pieces['scheme'], $home_url ),
				'',
				$this->strip_scheme_from_url( $url_pieces['scheme'], $url )
			);
		}

		return $this->sanitize_slash( $url );
	}

	/**
	 * Sanitizes the target url.
	 *
	 * @param string $url The url to sanitize.
	 *
	 * @return string The sanitized url.
	 */
	private function sanitize_target_url( $url ) {
		$home_url        = get_home_url();
		$home_url_pieces = wp_parse_url( $home_url );
		$url_pieces      = wp_parse_url( $url );

		if ( $this->match_home_url( $home_url_pieces, $url_pieces ) ) {
			$url = str_replace(
				$home_url_pieces['host'],
				'',
				$this->strip_scheme_from_url( $url_pieces['scheme'], $url ) );
		}

		return $this->sanitize_slash( $url );
	}

	/**
	 * Checks if the URL matches the home URL by comparing their host.
	 *
	 * @param array $home_url_pieces The pieces (wp_parse_url) from the home_url.
	 * @param array $url_pieces      The pieces (wp_parse_url) from the url to match.
	 *
	 * @return bool True when both hosts are equal.
	 */
	private function match_home_url( $home_url_pieces, $url_pieces ) {
		return ( isset( $url_pieces['scheme'], $url_pieces['host'] ) && $url_pieces['host'] === $home_url_pieces['host'] );
	}

}
