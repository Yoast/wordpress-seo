<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class will fetch a new status from Ryte and if it's necessary it will
 * notify the site admin by email and remove the current meta value to hide the
 * notice for all admin users.
 *
 * @deprecated 19.6
 * @codeCoverageIgnore
 */
class WPSEO_Ryte_Request {

	/**
	 * Sends a request to the Ryte API to check whether a URL is indexable.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param string $target_url The URL to check indexability for.
	 * @param array  $parameters Array of extra parameters to send to the Ryte API.
	 *
	 * @return array
	 */
	public function do_request( $target_url, $parameters = [] ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}
}
