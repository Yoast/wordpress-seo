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
	 * @param string $old_url The url that will be redirected.
	 * @param string $new_url The url where the old_url redirects to.
	 * @param int    $type    The type of the redirect.
	 *
	 * @return string
	 */
	public function format_url_redirect( $old_url, $new_url, $type ) {
		return 'location ' . $old_url . ' { add_header X-Redirect-By \"Yoast SEO Premium\"; return ' . $type . ' ' . $new_url . '; }';
	}

	/**
	 * Format REGEX redirect
	 *
	 * @param string $regex The regular expression that will be used to match with the requested url.
	 * @param string $url   The url where the old_url redirects to.
	 * @param int    $type  The type of the redirect.
	 *
	 * @return string
	 */
	public function format_regex_redirect( $regex, $url, $type ) {
		return 'location ~ ' . $regex . ' { return ' . $type . ' ' . $url . '; }';
	}

}
