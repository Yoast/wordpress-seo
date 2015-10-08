<?php
/**
 * @package WPSEO\Premium\Classes
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Class WPSEO_Apache_Redirect_File
 */
class WPSEO_Apache_Redirect_File extends WPSEO_Redirect_File {

	/**
	 * Format URL redirect
	 *
	 * @param string $old_url The current url that will be redirected.
	 * @param string $new_url The url where the old_url redirects to.
	 * @param int    $type    The type of the redirect.
	 *
	 * @return string
	 */
	public function format_url_redirect( $old_url, $new_url, $type ) {
		return 'Redirect ' . $type . ' ' . $this->add_url_slash( $old_url ) . ' ' . $this->add_url_slash( $new_url ) . PHP_EOL;
	}

	/**
	 * Format REGEX redirect
	 *
	 * @param string $regex The regular expression that will be used to match the requested url.
	 * @param string $url   The url where the old_url redirects to.
	 * @param int    $type  The type of the redirect.
	 *
	 * @return string
	 */
	public function format_regex_redirect( $regex, $url, $type ) {
		return 'RedirectMatch ' . $type . ' ' . $regex . ' ' . $url . PHP_EOL;
	}

	/**
	 * Check if first character is a slash, adds a slash if it ain't so
	 *
	 * @param string $url The url where slash will be added to.
	 *
	 * @return string mixed
	 */
	private function add_url_slash( $url ) {
		if ( $url[0] !== '/' ) {
			$url = '/' . $url;
		}

		return $url;
	}

}
