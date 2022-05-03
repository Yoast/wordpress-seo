<?php

namespace Yoast\WP\SEO\Routes;

use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use League\OAuth2\Server\Exception\OAuthServerException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\OAuth\OAuthWrapper;
use Yoast\WP\SEO\OAuth\UserEntity;

class OAuth_Routes implements Route_Interface {

	use No_Conditionals;

	const AUTHORIZE_ROUTE = 'oauth/authorize';

	const FULL_AUTHORIZE_ROUTE = Main::API_V1_NAMESPACE . '/' . self::AUTHORIZE_ROUTE;

	public function register_routes() {
		register_rest_route(Main::API_V1_NAMESPACE, self::AUTHORIZE_ROUTE, array(
			'methods' => 'POST',
			'callback' => [ $this, 'authorize' ],
			'permission_callback' => [ $this, 'can_authorize' ],
		));
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return
	 */
	public function authorize( $request ) {
		$oauth_wrapper = new OAuthWrapper();

		$server_request = ServerRequest::fromGlobals();

		try {
			$auth_request = $oauth_wrapper->server->validateAuthorizationRequest(
				$server_request
			);
			$auth_request->setUser(new UserEntity( get_current_user_id() ));
			$accepted = $request->get_param( 'accepted' );
			if ( isset( $accepted ) && $accepted === 'yes') {
				$auth_request->setAuthorizationApproved(true);
			} else {
				$auth_request->setAuthorizationApproved(false);
			}
			$response = $oauth_wrapper->server->completeAuthorizationRequest($auth_request, new Response());
			print_r($response->getHeaders());
			return rest_ensure_response( new WP_REST_Response(
				$response->getBody()->getContents(),
				$response->getStatusCode(),
				$response->getHeaders()
			) );

		} catch ( OAuthServerException $e ) {
			print_r( $e );
		}
	}

	public function can_authorize() {
		return current_user_can( 'edit_plugins' );
	}
}
