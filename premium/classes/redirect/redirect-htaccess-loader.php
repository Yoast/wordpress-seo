<?php
/**
 * @package WPSEO\Premium\Classes\Redirect\Loaders
 */

/**
 * Class for loading redirects from  .htaccess files.
 */
class WPSEO_Redirect_HTAccess_Loader extends WPSEO_Redirect_Abstract_Loader {

	/**
	 * @var string The contents of the htaccess file to import.
	 */
	protected $htaccess;

	/**
	 * WPSEO_Redirect_HTAccess_Loader constructor.
	 *
	 * @param string $htaccess The contents of the htaccess file to import.
	 */
	public function __construct( $htaccess ) {
		$this->htaccess = $htaccess;
	}

	/**
	 * Loads redirects as WPSEO_Redirects from the .htaccess file given to the constructor.
	 *
	 * @return WPSEO_Redirect[] The loaded redirects.
	 */
	public function load() {
		$redirects = array();

		// Loop through patterns.
		foreach ( self::regex_patterns() as $regex ) {
			$matches = $this->match_redirects( $regex['pattern'] );

			if ( is_array( $matches ) ) {
				$redirects = array_merge( $redirects, $this->convert_redirects_from_matches( $matches, $regex['type'] ) );
			}
		}

		return $redirects;
	}

	/**
	 * Matches the string (containing redirects) for the given regex
	 *
	 * @param string $pattern The regular expression to match redirects.
	 *
	 * @return mixed;
	 */
	protected function match_redirects( $pattern ) {
		preg_match_all( $pattern, $this->htaccess, $matches, PREG_SET_ORDER );

		return $matches;
	}

	/**
	 * Converts matches to WPSEO_Redirect objects.
	 *
	 * @param mixed  $matches The redirects to save.
	 * @param string $format  The format for the redirects.
	 *
	 * @return WPSEO_Redirect[] The redirects.
	 */
	protected function convert_redirects_from_matches( $matches, $format ) {
		$redirects = array();

		foreach ( $matches as $match ) {
			$type   = trim( $match[1] );
			$source = trim( $match[2] );
			$target = $this->parse_target( $type, $match );

			if ( $target === false || $source === '' || ! $this->validate_status_code( $type ) ) {
				continue;
			}

			$redirects[] = new WPSEO_Redirect( $source, $target, $type, $format );
		}

		return $redirects;
	}

	/**
	 * Parses the target from a match.
	 *
	 * @param string $type  The status code of the redirect.
	 * @param array  $match The match.
	 *
	 * @return bool|string The status code, false if no status code could be parsed.
	 */
	protected function parse_target( $type, $match ) {
		// If it's a gone status code that doesn't need a target.
		if ( $type === '410' ) {
			return '';
		}

		$target = trim( $match[3] );

		// There is no target, skip it.
		if ( $target === '' ) {
			return false;
		}

		return $target;
	}

	/**
	 * Returns regex patterns to match redirects in .htaccess files.
	 *
	 * @return array The regex patterns to test against.
	 */
	protected static function regex_patterns() {
		return array(
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect ([0-9]{3}) ([^"\s]+) ([a-z0-9-_+/.:%&?=#\][]+)`im',
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect ([0-9]{3}) "([^"]+)" ([a-z0-9-_+/.:%&?=#\][]+)`im',
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect (410) ([^"\s]+)`im', // Matches a redirect without a target.
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_PLAIN,
				'pattern' => '`^Redirect (410) "([^"]+)"`im', // Matches a redirect without a target.
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_REGEX,
				'pattern' => '`^RedirectMatch ([0-9]{3}) ([^"\s]+) ([^\s]+)`im',
			),
			array(
				'type'    => WPSEO_Redirect::FORMAT_REGEX,
				'pattern' => '`^RedirectMatch ([0-9]{3}) "([^"]+)" ([^\s]+)`im',
			),
		);
	}
}
