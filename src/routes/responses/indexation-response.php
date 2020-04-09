<?php
/**
 * Reindexation action for indexables
 *
 * @package Yoast\WP\SEO\Routes\Responses
 */

namespace Yoast\WP\SEO\Routes\Responses;

use WP_REST_Response;

/**
 * Reindexing_Reponse class
 */
class Indexation_Reponse extends WP_REST_Response {

	/**
	 * The response of a
	 *
	 * @param array  $objects  The objects that have been reindexed.
	 * @param string $next_url The url that should be called to continue reindexing. False if done.
	 */
	public function __construct( $objects, $next_url ) {
		parent::__construct( [
			'objects'  => $objects,
			'next_url' => $next_url,
		] );
	}
}
