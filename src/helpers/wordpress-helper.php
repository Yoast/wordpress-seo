<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for WordPress related logic.
 */
class WordPress_Helper {

	/**
	 * Checks if the WP-REST-API is available.
	 *
	 * @since 3.6
	 * @since 3.7 Introduced the $minimum_version parameter.
	 *
	 * @param string $minimum_version The minimum version the API should be.
	 *
	 * @return bool Returns true if the API is available.
	 */
	public function is_api_available( $minimum_version = '2.0' ) {
		return ( defined( 'REST_API_VERSION' ) && version_compare( REST_API_VERSION, $minimum_version, '>=' ) );
	}


}
