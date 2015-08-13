<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Nginx_Redirect_File
 *
 * @todo Add redirect type to NGINX redirects
 */
class WPSEO_Redirect_File_Nginx extends WPSEO_Redirect_File {

	/**
	 * %1$s is the redirect type
	 * %2$s is the old url
	 * %3$s is the new url
	 * @var string
	 */
	protected $url_format   = 'location %2$s { add_header X-Redirect-By \"Yoast SEO Premium\"; return %1$s %3$s; }';

	/**
	 * %1$s is the redirect type
	 * %2$s is the regex
	 * %3$s is the new url
	 *
	 * @var string
	 */
	protected $regex_format = 'location ~ %2$s { return %1$s %3$s; }';

}
