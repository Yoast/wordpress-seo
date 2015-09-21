<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Apache_Redirect_File
 */
class WPSEO_Redirect_File_Apache extends WPSEO_Redirect_File {

	/**
	 * %1$s is the redirect type
	 * %2$s is the old url
	 * %3$s is the new url
	 *
	 * @var string
	 */
	protected $url_format   = 'Redirect "%1$s" "%2$s" %3$s';

	/**
	 * %1$s is the redirect type
	 * %2$s is the regex
	 * %3$s is the new url
	 *
	 * @var string
	 */
	protected $regex_format = 'RedirectMatch %1$s %2$s %3$s';

	/**
	 * Overrides the parent method. This method will in case of url redirects add slashes to the url.
	 *
	 * @param string $redirect_format
	 * @param string $redirect_key
	 * @param array  $redirect
	 *
	 * @return string
	 */
	protected function format_redirect( $redirect_format, $redirect_key, array $redirect ) {
		if ( $this->current_type === 'url' ) {
			$redirect_key    = $this->add_url_slash( $redirect_key );
			$redirect['url'] = $this->add_url_slash( $redirect['url'] );
		}

		return parent::format_redirect( $redirect_format, $redirect_key, $redirect );
	}

	/**
	 * Check if first character is a slash, adds a slash if it ain't so
	 *
	 * @param string $url
	 *
	 * @return string mixed
	 */
	private function add_url_slash( $url ) {

		if ( $url[0] !== '/' && empty( parse_url( $url, PHP_URL_SCHEME ) ) ) {
			$url = '/' . $url;
		}

		return $url;
	}

}
