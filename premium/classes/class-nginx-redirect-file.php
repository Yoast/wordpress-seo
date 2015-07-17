<?php
/**
 * @package WPSEO\Premium\Classes
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
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
	 * @param string $old_url
	 * @param string $new_url
	 * @param int    $type
	 *
	 * @return string
	 */
	public function format_url_redirect( $old_url, $new_url, $type ) {
		return 'location ' . $old_url . ' { add_header X-Redirect-By \"Yoast SEO Premium\"; return ' . $type . ' ' . $new_url . '; }';
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
		return 'location ~ ' . $regex . ' { return ' . $type . ' ' . $url . '; }';
	}

}
