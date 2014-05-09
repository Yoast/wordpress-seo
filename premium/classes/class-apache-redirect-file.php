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
		return "Redirect " . $type . " " . $old_url . " " . $new_url;
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
		return "RewriteRule " . $regex . " " . $url . " [ R = " . $type . ", L ]";
	}

}