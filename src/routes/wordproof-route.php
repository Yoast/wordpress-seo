<?php

namespace Yoast\WP\SEO\Routes;

use WordProof\SDK\Support\Authentication;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\Third_Party\WordProof_Core_Inactive_Conditional;
use Yoast\WP\SEO\Main;

/**
 * Wincher_Route class.
 */
class WordProof_Route implements Route_Interface {

	/**
	 * The WordProof route prefix.
	 *
	 * @var string
	 */
	const ROUTE_PREFIX = 'wordproof';

	/**
	 * The authenticate route constant.
	 *
	 * @var string
	 */
	const AUTHENTICATION_ROUTE = self::ROUTE_PREFIX . '/authentication';

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ WordProof_Core_Inactive_Conditional::class ];
	}

	/**
	 * WordProof_Route constructor.
	 */
	public function __construct() {}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$authorize_route_args = [
			'methods'             => 'GET',
			'callback'            => [ $this, 'get_is_authenticated' ],
			'permission_callback' => [ $this, 'can_use_wordproof' ],
		];
		\register_rest_route( Main::API_V1_NAMESPACE, self::AUTHENTICATION_ROUTE, $authorize_route_args );

	}

	/**
	 * Returns the authorization URL.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get_is_authenticated() {
		$data = (object) [
			'status'    => 200,
			'is_authenticated'       => Authentication::isAuthenticated(),
		];

		return new WP_REST_Response( $data, $data->status );
	}

	/**
	 * Whether the current user is allowed to edit post/pages and thus use the WordProof integration.
	 *
	 * @return bool Whether the current user is allowed to use WordProof.
	 */
	public function can_use_wordproof() {
		return \current_user_can( 'edit_posts' ) || \current_user_can( 'edit_pages' );
	}
}
