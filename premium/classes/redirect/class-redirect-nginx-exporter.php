<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Exporter for Nginx, only declares the two formats
 */
class WPSEO_Redirect_Nginx_Exporter extends WPSEO_Redirect_File_Exporter {

	/**
	 * %1$s is the origin
	 * %2$s is the target
	 * %3$s is the redirect type
	 *
	 * @var string
	 */
	protected $url_format   = 'location /%1$s { add_header X-Redirect-By "Yoast SEO Premium"; return %3$s %2$s; }';

	/**
	 * %1$s is the origin
	 * %2$s is the target
	 * %3$s is the redirect type
	 *
	 * @var string
	 */
	protected $regex_format = 'location ~ %1$s { return %3$s "%2$s" ; }';

}
