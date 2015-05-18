<?php

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Class WPSEO_Nginx_Redirect_File
 *
 * @todo Add redirect type to NGINX redirects
 */
class WPSEO_Nginx_Redirect_File extends WPSEO_Redirect_File {

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
		return "location " . $old_url . " { add_header X-Redirect-By \"WordPress SEO by Yoast Premium\"; return " . $type . " " . $new_url . "; }";
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
		return 'location ~ ' . $regex . ' { return ' . $type . ' ' . $url . '; }';
	}

}