<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents a single redirect
 */
class WPSEO_Redirect implements ArrayAccess {

	const PERMANENT = 301;
	const FOUND		= 302;
	const TEMPORARY = 307;
	const DELETED   = 410;

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
	 *
	 * @throws InvalidArgumentException When DELETED type and target empty.
	 */
	public function __construct( $origin, $target = '', $type = self::PERMANENT, $format = self::FORMAT_PLAIN ) {
		$type = (int) $type;

		if ( $target === '' &&  $type !== self::DELETED ) {
			throw new InvalidArgumentException( 'Target cannot be empty for a ' . $type . ' redirect.' );
		}

		$this->origin = ($origin !== '') ? self::format_origin( $origin, $format ) : '';
		$this->target = self::format_target( $target );

		$this->type   = $type;
		$this->format = $format;
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
	 * Returns the origin without any slashes
	 *
	 * @return string
	 */
	public function get_sanitized_origin() {
		return $this->sanitize_slash( $this->origin );
	}
	/**
	 * Returns the origin without any slashes
	 *
	 * @return string
	 */
	public function get_sanitized_target() {
		return $this->sanitize_slash( $this->target );
	}

	/**
	 * Formats the given origin in case of plain redirects
	 *
	 * @param string $origin The origin to format.
	 * @param string $format The redirect format, regex or plain.
	 *
	 * @return string
	 */
	public static function format_origin( $origin, $format ) {
		return ( $format === self::FORMAT_PLAIN ) ? WPSEO_Utils::format_url( $origin ) : $origin;
	}

	/**
	 * Formats the given origin in case of plain redirects
	 *
	 * @param string $target The target to format.
	 *
	 * @return string
	 */
	public static function format_target( $target ) {
		return ( parse_url( $target, PHP_URL_SCHEME ) ) ? $target : WPSEO_Utils::format_url( $target );
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
	 * Strip the trailing slashes
	 *
	 * @param string $url_to_sanitize The url to sanitize.
	 *
	 * @return string
	 */
	private function sanitize_slash( $url_to_sanitize ) {
		$url = $url_to_sanitize;
		if ( $this->format === WPSEO_Redirect::FORMAT_PLAIN ) {
			$url = trim( $url_to_sanitize, '/' );
		}

		return $url;
	}
}
