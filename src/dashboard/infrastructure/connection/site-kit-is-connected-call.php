<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Connection;

use WP_REST_Request;

/**
 * Class that hold the code to do the REST call to the Site Kit api.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Kit_Is_Connected_Call {

	/**
	 * Runs the internal REST api call.
	 *
	 * @return bool
	 */
	public function is_setup_completed(): bool {
		$request = new WP_REST_Request( 'GET', '/google-site-kit/v1/core/site/data/connection' );

		$data = \rest_do_request( $request );

		return $data->get_data()['setupCompleted'];
	}

	/**
	 * Runs the internal REST api call.
	 *
	 * @return bool
	 */
	public function is_ga_connected(): bool {
		$request = new WP_REST_Request( 'GET', '/google-site-kit/v1/core/modules/data/list' );
		$data    = \rest_do_request( $request )->get_data();

		$connected = false;
		foreach ( $data as $module ) {
			if ( $module['slug'] === 'analytics-4' ) {
				$connected = $module['connected'];
			}
		}

		return $connected;
	}
}
