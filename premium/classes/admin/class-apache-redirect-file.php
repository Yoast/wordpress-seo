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
	 *
	 * @return string
	 */
	public function format_url_redirect( $old_url, $new_url ) {
		return "Redirect 301 " . $old_url . " " . $new_url;
	}

	/**
	 * Format REGEX redirect
	 *
	 * @param $regex
	 * @param $url
	 *
	 * @return string
	 */
	public function format_regex_redirect( $regex, $url ) {
		return "RewriteRule " . $regex . " " . $url . " [L]";
	}

}