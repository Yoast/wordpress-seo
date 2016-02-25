<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents a single redirect
 */
class WPSEO_Redirect implements ArrayAccess {

	const PERMANENT   = 301;
	const FOUND		  = 302;
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
		$this->origin = ($format === WPSEO_Redirect::FORMAT_PLAIN) ? $this->sanitize_slash( $origin ) : $origin;
		$this->target = $this->sanitize_slash( $target );
		$this->format = $format;
		$this->type   = (int) $type;

	}

	/**
	 * Returns the origin.
	 *
	 * @return string
	 */
	public function get_origin() {
		return $this->origin;
	}

	/**
	 * Returns the target
	 *
	 * @return string
	 */
	public function get_target() {
		return $this->target;
	}

	/**
	 * Returns the type
	 *
	 * @return int
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * Returns the format
	 *
	 * @return string
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
		return in_array( $offset, array( 'url', 'type' ) );
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
			case 'old' :
				return $this->origin;
				break;
			case 'url' :
				return $this->target;
				break;
			case 'type' :
				return $this->type;
				break;
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
	 */
	public function offsetSet( $offset, $value ) {
		switch ( $offset ) {
			case 'url' :
				$this->target = $value;
				break;
			case 'type' :
				$this->type = $value;
				break;
		}
	}

	/**
	 * (PHP 5 &gt;= 5.0.0) - Offset to unset
	 *
	 * @link http://php.net/manual/en/arrayaccess.offsetunset.php
	 *
	 * @param string $offset The offset to unset.
	 */
	public function offsetUnset( $offset ) {

	}

	/**
	 * Compares an url with the origin of the redirect.
	 *
	 * @param string $url The URL to compare.
	 *
	 * @return bool
	 */
	public function origin_is( $url ) {
		// Sanitize the slash in case of plain redirect.
		if ( $this->format === WPSEO_Redirect::FORMAT_PLAIN ) {
			$url = $this->sanitize_slash( $url );
		}

		return (string) $this->origin === (string) $url;
	}

	/**
	 * Strip the trailing slashes for relative URLs.
	 *
	 * @param string $url_to_sanitize The url to sanitize.
	 *
	 * @return string
	 */
	private function sanitize_slash( $url_to_sanitize ) {
		$url = $url_to_sanitize;
		if ( ! $this->is_absolute_url( $url_to_sanitize ) && $url !== '/' ) {
			$url = trim( $url_to_sanitize, '/' );
		}

		return $url;
	}

	/**
	 * Check if given URL is an absolute or relative URL.
	 *
	 * @param string $url the url to check if url is absolute.
	 *
	 * @return bool
	 */
	private function is_absolute_url( $url ) {
		$url = parse_url( $url, PHP_URL_SCHEME );

		if ( $url ) {
			return true;
		}

		return false;
	}
}
