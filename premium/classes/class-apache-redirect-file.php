<?php
/**
 * @package Premium\Apache_Redirect_File
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
	 * @param string $old_url
	 * @param string $new_url
	 * @param int    $type
	 *
	 * @return string
	 */
	public function format_url_redirect( $old_url, $new_url, $type ) {
		return 'Redirect ' . $type . ' ' . $this->add_url_slash( $old_url ) . ' ' . $this->add_url_slash( $new_url ) . PHP_EOL;
	}

	/**
	 * Format REGEX redirect
	 *
	 * @param string $regex
	 * @param string $url
	 * @param int    $type
	 *
	 * @return string
	 */
	public function format_regex_redirect( $regex, $url, $type ) {
		return 'RedirectMatch ' . $type . ' ' . $regex . ' ' . $url . PHP_EOL;
	}

	/**
	 * Check if first character is a slash, adds a slash if it ain't so
	 *
	 * @param string $url
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
