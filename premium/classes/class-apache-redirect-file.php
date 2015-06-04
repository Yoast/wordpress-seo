<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_Apache_Redirect_File extends WPSEO_Redirect_File {

	/**
	 * Format URL redirect
	 *
	 * @param $old_url
	 * @param $new_url
	 * @param $type
	 *
	 * @return string
	 */
	public function format_url_redirect( $old_url, $new_url, $type ) {
		$redirect = "Redirect " . $type . " " . $this->add_url_slash( $old_url ) . " " . $this->add_url_slash( $new_url ) . PHP_EOL;
		$redirect .= "Header always set X-Redirect-By \"WordPress SEO by Yoast Premium\"";

		return $redirect;
	}

	/**
	 * Format REGEX redirect
	 *
	 * @param $regex
	 * @param $url
	 * @param $type
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